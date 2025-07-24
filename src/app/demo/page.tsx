export default function DemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8">Demo Tailwind CSS Styles</h1>
      
      {/* Colors Demo */}
      <section className="mb-12">
        <h2 className="mb-4">Brand Colors</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Primary</h3>
            <div className="space-y-2">
              <div className="p-3 bg-primary-50 text-primary-900 rounded">Primary 50</div>
              <div className="p-3 bg-primary-500 text-white rounded">Primary 500</div>
              <div className="p-3 bg-primary-900 text-white rounded">Primary 900</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Secondary</h3>
            <div className="space-y-2">
              <div className="p-3 bg-secondary-50 text-secondary-900 rounded">Secondary 50</div>
              <div className="p-3 bg-secondary-500 text-white rounded">Secondary 500</div>
              <div className="p-3 bg-secondary-900 text-white rounded">Secondary 900</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Accent</h3>
            <div className="space-y-2">
              <div className="p-3 bg-accent-50 text-accent-900 rounded">Accent 50</div>
              <div className="p-3 bg-accent-500 text-white rounded">Accent 500</div>
              <div className="p-3 bg-accent-900 text-white rounded">Accent 900</div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Demo */}
      <section className="mb-12">
        <h2 className="mb-4">Typography</h2>
        <div className="space-y-4">
          <h1>Heading 1 - Font Inter</h1>
          <h2>Heading 2 - Font Inter</h2>
          <h3>Heading 3 - Font Inter</h3>
          <h4>Heading 4 - Font Inter</h4>
          <h5>Heading 5 - Font Inter</h5>
          <h6>Heading 6 - Font Inter</h6>
          <p>This is a paragraph with the Inter font family. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p className="text-muted-foreground">This is muted text</p>
          <a href="#">This is a link with hover effect</a>
        </div>
      </section>

      {/* Buttons Demo */}
      <section className="mb-12">
        <h2 className="mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-outline">Outline Button</button>
          <button className="btn btn-primary" disabled>Disabled Button</button>
        </div>
      </section>

      {/* Card Demo */}
      <section className="mb-12">
        <h2 className="mb-4">Card Component</h2>
        <div className="card max-w-md">
          <h3 className="text-xl font-semibold mb-2">Card Title</h3>
          <p className="text-muted-foreground mb-4">This is a card component with custom styling using CSS variables.</p>
          <button className="btn btn-primary">Action</button>
        </div>
      </section>

      {/* Form Demo */}
      <section className="mb-12">
        <h2 className="mb-4">Form Elements</h2>
        <div className="max-w-md space-y-4">
          <div>
            <label htmlFor="input1" className="block text-sm font-medium mb-2">Input Field</label>
            <input type="text" id="input1" className="input" placeholder="Enter text here..." />
          </div>
          <div>
            <label htmlFor="input2" className="block text-sm font-medium mb-2">Disabled Input</label>
            <input type="text" id="input2" className="input" placeholder="Disabled input" disabled />
          </div>
        </div>
      </section>

      {/* Animations Demo */}
      <section className="mb-12">
        <h2 className="mb-4">Animations</h2>
        <div className="flex gap-4">
          <div className="p-4 bg-primary-100 rounded animate-fade-in">Fade In</div>
          <div className="p-4 bg-secondary-100 rounded animate-slide-in">Slide In</div>
        </div>
      </section>

      {/* Utilities Demo */}
      <section className="mb-12">
        <h2 className="mb-4">Utility Classes</h2>
        <div className="space-y-4">
          <p className="text-balance max-w-md border border-gray-200 p-4 rounded">
            This text uses the .text-balance utility for better text wrapping on multiple lines.
          </p>
          <div className="max-w-md border border-gray-200 p-4 rounded">
            <p className="mb-2">Scrollable content with hidden scrollbar:</p>
            <div className="h-24 overflow-y-auto scrollbar-hide bg-gray-50 p-2 rounded">
              <p>Line 1</p>
              <p>Line 2</p>
              <p>Line 3</p>
              <p>Line 4</p>
              <p>Line 5</p>
              <p>Line 6</p>
              <p>Line 7</p>
              <p>Line 8</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
