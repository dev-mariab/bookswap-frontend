/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export interface UIComponent {
  render(): React.ReactNode;
  add?(component: UIComponent): void;
  remove?(component: UIComponent): void;
  getChild?(index: number): UIComponent | null;
}
export class Button implements UIComponent {
  constructor(
    private label: string,
    private onClick: () => void,
    private className: string = ''
  ) {}
  
  render(): React.ReactNode {
    return (
      <button 
        onClick={this.onClick}
        className={`px-4 py-2 rounded-lg ${this.className}`}
      >
        {this.label}
      </button>
    );
  }
}
export class Input implements UIComponent {
  constructor(
    private placeholder: string,
    private value: string,
    private onChange: (value: string) => void,
    private type: string = 'text'
  ) {}
  
  render(): React.ReactNode {
    return (
      <input
        type={this.type}
        placeholder={this.placeholder}
        value={this.value}
        onChange={(e) => this.onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />
    );
  }
}
export class FormContainer implements UIComponent {
  private children: UIComponent[] = [];
  private title: string;
  
  constructor(title: string) {
    this.title = title;
  }
  
  add(component: UIComponent): void {
    this.children.push(component);
  }
  
  remove(component: UIComponent): void {
    const index = this.children.indexOf(component);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }
  
  getChild(index: number): UIComponent | null {
    return this.children[index] || null;
  }
  
  render(): React.ReactNode {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">{this.title}</h3>
        <div className="space-y-4">
          {this.children.map((child, index) => (
            <div key={index}>{child.render()}</div>
          ))}
        </div>
      </div>
    );
  }
}

export class BookCard implements UIComponent {
  private children: UIComponent[] = [];
  private book: any;
  
  constructor(book: any) {
    this.book = book;
  }
  
  add(component: UIComponent): void {
    this.children.push(component);
  }
  
  render(): React.ReactNode {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {this.book.imagem && (
          <img 
            src={this.book.imagem} 
            alt={this.book.titulo}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h4 className="font-bold text-gray-900">{this.book.titulo}</h4>
          <p className="text-sm text-gray-600">{this.book.autor}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-green-600 font-bold">
              R$ {this.book.preco.toFixed(2)}
            </span>
            {this.children.map((child, index) => (
              <div key={index}>{child.render()}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}