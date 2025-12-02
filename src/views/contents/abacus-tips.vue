<template>
  <div class="content is-medium">
    <h3>
      <img :src="require('@@/img/icons/bulb.svg')" width="25px" /> 1 xonali
      sonlarni 1 xonalik sonlarga ko'paytirish
    </h3>
    1 xonali sonni 1 xonali songa ko'paytirish oddiy karra jadvali yordamida
    bajariladi. Misol uchun <code>2 x 2</code> berilgan bo'lsa, karra jadvalida
    ushbu misol qiymati <code>4</code> ga teng va abacusda quyidagi ko'rinishga
    ega:

    <figure>
      <img :src="require('@@/img/tips/abacus-4.png')" />
      <figcaption>4 raqamining abacusda ko'rinishi</figcaption>
    </figure>

    <h3>
      <img :src="require('@@/img/icons/bulb.svg')" width="25px" /> 2 xonali
      sonlarni 1 xonalik sonlarga ko'paytirish
    </h3>
    <code>45 x 5</code> misol berilgan bo'lsa, birinchi birlar xonasidagi sonni
    bir xonali songa ko'paytiramiz. Ya'ni: <code>5 x 5 = 25</code> va
    <code>25</code> abacusda ushbu ko'rinishga ega:

    <figure>
      <img :src="require('@@/img/tips/abacus-25.png')" />
      <figcaption>25 raqamining abacusda ko'rinishi</figcaption>
    </figure>

    Keyingi qilinadigan ish bu 1 xonalik sonni 2 xonalik sonning o'nlar xonasiga
    ko'paytirish. Ya'ni <code>4 x 5 = 20</code> va <code>20</code> abacusda
    ushbu ko'rinishga ega:

    <figure>
      <img :src="require('@@/img/tips/abacus-20.png')" />
      <figcaption>20 raqamining abacusda ko'rinishi</figcaption>
    </figure>

    4 soni o'nlar xonasida turgani sababli 20 sonini o'nlar xonasiga yozamiz.
    Javob 225 va <code>225</code> abacusda ushbu ko'rinishga ega:

    <figure>
      <img :src="require('@@/img/tips/abacus-225.png')" />
      <figcaption>225 raqamining abacusda ko'rinishi</figcaption>
    </figure>
  </div>
</template>
