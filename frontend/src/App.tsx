import { Card, CardFooter, CardHeader } from "./components/ui/card";

function App() {
  return (
    <div className="bg-white">
      <Card className="w-fit mx-auto hover:scale-105 mt-5 transition-all duration-100">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">
            Hackathon is gonna be <strong>GOATED</strong>
          </h2>
        </CardHeader>
        {/* Add CardContent and CardFooter here */}
        <CardFooter className="text-center text-sm text-gray-500">
          We're going to cook! 🧑‍🍳
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
