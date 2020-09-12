module.exports = {
  trailingComma: 'none',
  printWidth: 100,
  overrides: [
    {
      files: ['*.ts', '*.js', '*.vue'],
      options: {
        singleQuote: true
      }
    }
  ]
};
