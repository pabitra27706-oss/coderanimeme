import turtle

screen = turtle.Screen()
screen.bgcolor("black")

pen = turtle.Turtle()
pen.speed(0)
pen.width(2)

colors = ["red", "orange", "yellow", "green", "cyan", "blue", "magenta"]

for i in range(120):
    pen.color(colors[i % len(colors)])
    pen.circle(120)
    pen.left(59)

pen.hideturtle()
screen.mainloop()