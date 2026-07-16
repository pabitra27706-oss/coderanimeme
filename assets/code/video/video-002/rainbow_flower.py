import turtle
import colorsys

screen = turtle.Screen()
screen.bgcolor("black")
screen.setup(480, 850)
screen.title("Rainbow Flower")
screen.colormode(1.0)

t = turtle.Turtle()
t.speed(0)
t.hideturtle()
turtle.tracer(5, 0)

num_petals = 18
num_layers = 42
arc_extent = 45

for petal in range(num_petals):
    angle = petal * (360 / num_petals)
    hue = petal / num_petals

    for layer in range(2, num_layers):
        progress = layer / num_layers

        if progress < 0.6:
            brightness = 0.3 + (7 / 6) * progress
            saturation = 1.0
        else:
            fade = (progress - 0.6) / 0.4
            brightness = 1.0 - 0.7 * fade
            saturation = 1.0 - 0.7 * fade

        r, g, b = colorsys.hsv_to_rgb(hue, max(0, saturation), max(0, min(1, brightness)))
        t.pencolor(r, g, b)
        t.pensize(1)
        radius = layer * 9

        t.penup()
        t.goto(0, 0)
        t.setheading(angle - arc_extent / 2)
        t.pendown()

        t.circle(radius, arc_extent)
        t.left(180 - arc_extent)
        t.circle(radius, arc_extent)
        t.left(180 - arc_extent)

    turtle.update()

t.penup()
t.goto(0, -35)
t.setheading(0)
t.pendown()
t.fillcolor("black")
t.pencolor("black")
t.begin_fill()
t.circle(35)
t.end_fill()

turtle.update()
screen.mainloop()