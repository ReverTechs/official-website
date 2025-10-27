export function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Animated Circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Blessings Chilemba
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Developer & App Creator
          </p>
        </div>

        <div className="space-y-6 animate-fade-in-up">
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Crafting digital experiences that make a difference. 
            Building innovative apps and solutions that empower users.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#about"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Learn More
            </a>
            <a
              href="#apps"
              className="px-8 py-3 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              View My Apps
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}

