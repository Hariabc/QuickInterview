import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class ResumeParser {
  constructor() {
    this.emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    this.phoneRegex = /(\+?1[-.\s]?)?(\(?[0-9]{3}\)?[-.\s]?)?[0-9]{3}[-.\s]?[0-9]{4}/g;
    this.nameRegex = /^[A-Za-z\s]+$/;
  }

  async parseResume(file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    try {
      if (fileExtension === 'pdf') {
        return await this.parsePDF(file);
      } else if (fileExtension === 'docx') {
        return await this.parseDOCX(file);
      } else {
        throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }

  async parsePDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return this.extractInfo(fullText);
  }

  async parseDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return this.extractInfo(result.value);
  }

  extractInfo(text) {
    const info = {
      name: null,
      email: null,
      phone: null,
      fullText: text,
    };

    // Extract email
    const emails = text.match(this.emailRegex);
    if (emails && emails.length > 0) {
      info.email = emails[0];
    }

    // Extract phone
    const phones = text.match(this.phoneRegex);
    if (phones && phones.length > 0) {
      info.phone = phones[0];
    }

    // Extract name - look for patterns at the beginning of the document
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      
      // Skip lines that are clearly not names
      if (line.length > 50 || 
          line.includes('@') || 
          line.includes('http') ||
          line.match(/\d{3,}/) ||
          !this.nameRegex.test(line)) {
        continue;
      }

      // Check if it looks like a name (2-4 words, mostly letters)
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        const isValidName = words.every(word => 
          word.length > 1 && 
          this.nameRegex.test(word) &&
          !['resume', 'cv', 'curriculum', 'vitae'].includes(word.toLowerCase())
        );
        
        if (isValidName) {
          info.name = line;
          break;
        }
      }
    }

    return info;
  }

  // Get missing fields for user input
  getMissingFields(parsedInfo) {
    const missing = [];
    
    if (!parsedInfo.name) {
      missing.push('name');
    }
    if (!parsedInfo.email) {
      missing.push('email');
    }
    if (!parsedInfo.phone) {
      missing.push('phone');
    }
    
    return missing;
  }

  // Validate user input
  validateField(field, value) {
    switch (field) {
      case 'name':
        return this.nameRegex.test(value) && value.trim().length > 0;
      case 'email':
        return this.emailRegex.test(value);
      case 'phone':
        return this.phoneRegex.test(value);
      default:
        return false;
    }
  }
}

export default new ResumeParser();
