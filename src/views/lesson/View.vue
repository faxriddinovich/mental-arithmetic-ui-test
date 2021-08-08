<template>
  <section>
    <div class="columns is-centered is-desktop">
      <div class="column is-6-desktop mx-2">
        <div class="columns is-multiline is-desktop">
          <div class="column is-12-desktop mt-4">
            <div class="tabs is-toggle is-fullwidth">
              <ul>
                <li class="is-active">
                  <a>
                    <img src="@/assets/book.svg" width="20" />&nbsp;&nbsp;
                    <span>Lesson</span>
                  </a>
                </li>
                <li>
                  <a>
                    <img
                      src="@/assets/knowledge.svg"
                      width="20"
                    />&nbsp;&nbsp;<span>Test knowledge: <b>2</b></span>
                  </a>
                </li>
                <li>
                  <a>
                    <img
                      src="@/assets/comment.svg"
                      width="20"
                    />&nbsp;&nbsp;<span>Comments: <b>0</b></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="column is-12-desktop">
            <div class="card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img
                    src="https://www.enterprisestorageforum.com/wp-content/uploads/2019/05/computer-memory.jpeg"
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div class="card-content">
                <nav
                  class="breadcrumb has-arrow-separator"
                  aria-label="breadcrumbs"
                >
                  <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Computer science lessons</a></li>
                    <li class="is-active">
                      <a href="#">How does memory work #2</a>
                    </li>
                  </ul>
                </nav>
                <!-- <p class="title">How does memory work</p> -->
                In computing, memory is a device or system that is used to store
                information for immediate use in a computer or related computer
                hardware and digital electronic devices.[1] The term memory is
                often synonymous with the term primary storage or main memory.
                An archaic synonym for memory is store.[2]
                <br />
                <br />
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/p3q5zWCw8J4?controls=0"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
                n the early 1940s, memory technology often permitted a capacity
                of a few bytes. The first electronic programmable digital
                computer, the ENIAC, using thousands of vacuum tubes, could
                perform simple calculations involving 20 numbers of ten decimal
                digits stored in the vacuum tubes. The next significant advance
                in computer memory came with acoustic delay line memory,
                developed by J. Presper Eckert in the early 1940s. Through the
                construction of a glass tube filled with mercury and plugged at
                each end with a quartz crystal, delay lines could store bits of
                information in the form of sound waves propagating through the
                mercury, with the quartz crystals acting as transducers to read
                and write bits. Delay line memory was limited to a capacity of
                up to a few thousand bits. Two alternatives to the delay line,
                the Williams tube and Selectron tube, originated in 1946, both
                using electron beams in glass tubes as means of storage. Using
                cathode ray tubes, Fred Williams invented the Williams tube,
                which was the first random-access computer memory. The Williams
                tube was more capacious than the Selectron tube (the Selectron
                was limited to 256 bits, while the Williams tube could store
                thousands) and less expensive. The Williams tube was
                nevertheless frustratingly sensitive to environmental
                disturbances. Efforts began in the late 1940s to find
                non-volatile memory. Magnetic-core memory allowed for recall of
                memory after power loss. It was developed by Frederick W. Viehe
                and An Wang in the late 1940s, and improved by Jay Forrester and
                Jan A. Rajchman in the early 1950s, before being commercialised
                with the Whirlwind computer in 1953.[6] Magnetic-core memory was
                the dominant form of memory until the development of MOS
                semiconductor memory in the 1960s.[7] Semiconductor memory began
                in the early 1960s with bipolar memory, which used bipolar
                transistors.[7] Bipolar semiconductor memory made from discrete
                devices was first shipped by Texas Instruments to the United
                States Air Force in 1961. The same year, the concept of
                solid-state memory on an integrated circuit (IC) chip was
                proposed by applications engineer Bob Norman at Fairchild
                Semiconductor.[8] The first bipolar semiconductor memory IC chip
                was the SP95 introduced by IBM in 1965.[7] While bipolar memory
                offered improved performance over magnetic-core memory, it could
                not compete with the lower price of magnetic-core, which
                remained dominant up until the late 1960s.[7] Bipolar memory
                failed to replace magnetic-core memory because bipolar flip-flop
                circuits were too large and expensive.[9]

                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c9/ENIAC_Penn2.jpg"
                />
                <hr />
                <b-taglist>
                  <b-tag>How does memory work</b-tag>
                  <b-tag>Type of memory</b-tag>
                  <b-tag>Video</b-tag>
                  <b-tag>Image</b-tag>
                  <b-tag>How does memory work</b-tag>
                  <b-tag>Type of memory</b-tag>
                  <b-tag>Video</b-tag>
                  <b-tag>Image</b-tag>
                  <b-tag>How does memory work</b-tag>
                  <b-tag>Type of memory</b-tag>
                  <b-tag>Video</b-tag>
                  <b-tag>Image</b-tag>
                </b-taglist>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-vcentered">
          <div class="column is-5">
            <b-button type="is-primary" icon-left="angle-left" expanded
              ><b>#1</b> How does everything work</b-button
            >
          </div>
          <div class="column is-2"></div>
          <div class="column is-5">
            <b-button type="is-primary" icon-right="angle-right" expanded
              ><b>#3</b> How does CPU work</b-button
            >
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
export default class ViewLesson extends Vue {}
</script>

<style lang="scss">
.card-bottom-left {
  position: absolute;
  bottom: 0px;
  margin-bottom: 4px;
  margin-left: 4px;
  z-index: 1;
}
</style>
