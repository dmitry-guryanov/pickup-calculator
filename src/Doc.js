import React from 'react';
import {Context, Node} from 'react-mathjax'

let f2 = `\\begin{cases} I = I_1 + I_2 + I_3 \\\\ \\frac{I_1}{i\\omega C_x} = I_2(R_t + \\frac{1}{i\\omega C_t}) = I_3 R_x \\\\ U_p = I i\\omega L_p + IR_p + I_3 R_x \\end{cases}`
let f3 = `I_1 = I_3 i\\omega C_x R_x \\\\ I_2 = I_3 \\frac{R_x}{R_t + \\frac{1}{i\\omega C_x}} \\\\ I = I_3(i\\omega C_x R_x + \\frac{R_x}{R_t + \\frac{1}{i\\omega C_x}} + 1) = a I_3 \\\\ U_p = I(i\\omega L_p + R_p + \\frac{R_x}{a})`
let f4 = `K = \\frac{I_3 R_x}{U_p} = \\frac{\\frac{I}{a}R_x}{U_p} = \\frac{R_x}{ia \\omega L_p + aR_p + R_x}`
let f5 = `\\frac{R_x}{R_t + \\frac{1}{i\\omega C_x}} = \\frac{i \\omega C_t R_x}{1 + i \\omega C_t R_t} = \\frac{i \\omega C_t R_x (1 - i \\omega C_t R_t)}{1 + \\omega^2 C_t^2 R_t^2} = \\frac{\\omega C_t R_x(i + \\omega C_t R_t)}{1 + \\omega^2 C_t^2 R_t^2} = b \\omega C_t R_x(i + \\omega C_t R_t)`
let f6 = `ia \\omega L_p + aR_p + R_x = (i\\omega L_p + R_p)(i \\omega C_x R_x + b\\omega C_t R_x (i + \\omega C_t R_t) + 1) + R_x = \\\\ (R_p + R_x - \\omega^2 R_x(L_p C_x + b C_t(L_p - C_t R_t R_p))) + i(\\omega(L_p + C_x R_x R_p + bC_t R_x(R_p + \\omega^2 L_p R_t C_t))) = \\\\ x + iy`
let f7 = `K_a = \\sqrt{KK^\\ast} = \\frac{R_x}{\\sqrt{x^2 + y^2}} = \\\\ \\frac{1}{\\sqrt{(\\frac{R_p}{R_x} + 1 - \\omega^2(L_p C_x + b C_t(L_p - C_t R_t R_p))^2 + \\omega^2 (\\frac{L_p}{R_x} + C_x R_p + bC_t(R_p + \\omega^2 L_p R_t C_t))^2}}`
let f8 = `b = \\frac{1}{1 + \\omega^2 C_t^2 R_t^2}`


var doc = (
<div>

<Context>
<div>
<h1>About</h1>
<p>This application is intended to evaluate frequency response from your guitar pickup with given parameters.
You can type you pickup parameters, cable capacitance and amplifier resistance and see how it will work
together. Also you can plot several lines on a single chart to compare.</p>

<p>
Electric guitar with magnetic pickup can be represented with the following electrical scheme, if we set volume and tone to their maximum positions:
<img alt="first electrical screme" className="centered" src='/scheme5x.png' />
</p>

<p>
<Node inline>C_p</Node> and <Node inline>C_c</Node> are parallels, so we can replace them with <Node inline>C_x = C_p + C_c</Node>. Also <Node inline>R_v</Node> and <Node inline>R_l</Node> are also parallel, we can replace them with <Node inline>R_x = (R_v R_l) / (R_v + R_l)</Node>. This results in scheme:
<img alt="second electrical scheme" className="centered" src='/scheme6x.png' /></p>

<p>We need to determine the dependency of voltage amplitude between x1 and x2 from frequency. We can do it using complex
amplitude method and Kirchhoff's laws:</p>

<p>
<Node>{f2}</Node>
</p>

<p>Solution:<br />
<Node>{f3}</Node>
</p>

<p>We're looking for ratio of voltage on <Node inline>R_x</Node> to input <Node inline>U_p</Node>, which equals:
<Node>{f4}</Node>
</p>

<p>Before replacing <Node inline>a</Node>, let's convert the last equation:
<Node>{f5}</Node>
</p>

<p>
Let's replace <Node inline>a</Node> in the denominator of the equation for <Node inline>K</Node>:
<Node>{f6}</Node>
</p>

<p>
Since we're interested in voltage amplitude on <Node inline>R_x</Node>, so:
<Node>{f7}</Node>
Where:
<Node>{f8}</Node>
</p>
<p>
This application just plots this function graph.
</p>

</div>
</Context>
</div>
)

export default doc
