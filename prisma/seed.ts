import { PrismaClient, Role, OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("CREATE SEED...");

    await prisma.user.createMany({
        data: [
          {
            id: 1,
            name: "admin",
            email: "admin@gmail.com",
            passwordHash: "123456789",
            role: Role.ADMIN,
          },
          {
            name: "tourist",
            email: "tourist@gmail.com",
            passwordHash: "123456",
            role: Role.TOUR_MANAGER,
          }
      ]
    });

    await prisma.category.createMany({
        data: [
            {
                name: "Biển đảo",
                description: "Các tour nghỉ dưỡng và khám phá vùng biển, đảo.",
            },
            {
                name: "Văn hóa - Lịch sử",
                description: "Các tour tìm hiểu di tích, văn hóa và lịch sử địa phương.",
            },
            {
                name: "Ẩm thực",
                description: "Các tour trải nghiệm ẩm thực và đặc sản vùng miền.",
            },
            {
                name: "Nghỉ dưỡng cao cấp",
                description: "Các tour nghỉ dưỡng tại resort và khách sạn cao cấp.",
            },
            {
                name: "Phiêu lưu - Mạo hiểm",
                description: "Các tour trekking, leo núi, và trải nghiệm mạo hiểm.",
            },
        ],
    });

    await prisma.location.createMany({
        data: [
            { name: "Đà Nẵng" },
            { name: "Phú Quốc" },
            { name: "Ninh Bình" },
            { name: "Huế - Hội An" },
            { name: "Sapa" },
            { name: "Hạ Long" },
            { name: "Đà Lạt" },
            { name: "Tây Ninh" },
            { name: "Miền Tây" },
            { name: "Nha Trang" },
        ],
    });

    await prisma.tour.createMany({
        data: [
            {
                name: "Tour Đà Nẵng 3N2Đ",
                description: `
    <h2>Giới thiệu Tour Đà Nẵng 3N2Đ</h2>

    <p>
      Đà Nẵng là một trong những thành phố biển đẹp nhất Việt Nam, nổi bật với bãi biển Mỹ Khê thơ mộng,
      những cây cầu biểu tượng bắc qua sông Hàn và vị trí thuận lợi để khám phá các điểm đến nổi tiếng như
      Bà Nà Hills, Hội An, Ngũ Hành Sơn. Không khí trong lành, nhịp sống năng động nhưng vẫn dễ chịu khiến
      Đà Nẵng trở thành lựa chọn lý tưởng cho các chuyến du lịch ngắn ngày.
    </p>

    <p>
      Tour Đà Nẵng 3N2Đ mang đến cho bạn hành trình kết hợp hoàn hảo giữa <strong>nghỉ dưỡng biển</strong>,
      <strong>tham quan văn hóa – tâm linh</strong> và <strong>trải nghiệm vui chơi giải trí hiện đại</strong>.
      Bạn sẽ có cơ hội tắm biển Mỹ Khê, chiêm ngưỡng thành phố từ Bà Nà Hills và Cầu Vàng, khám phá phố cổ Hội An
      lung linh đèn lồng, đồng thời thưởng thức ẩm thực miền Trung đặc sắc.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
        alt="Toàn cảnh bãi biển Mỹ Khê Đà Nẵng với cát trắng và nước biển trong xanh"
        loading="lazy"
      />
    </div>

    <p>
      Bên cạnh đó, những biểu tượng hiện đại như Cầu Rồng, Cầu Sông Hàn, Cầu Trần Thị Lý cùng những tuyến phố ven
      sông về đêm tạo nên một Đà Nẵng vừa trẻ trung, vừa lãng mạn. Dù bạn đi cùng gia đình, nhóm bạn hay cặp đôi,
      hành trình 3N2Đ tại Đà Nẵng đều mang lại nhiều trải nghiệm đáng nhớ.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        alt="Cầu Vàng tại Bà Nà Hills với cảnh núi rừng mờ sương"
        loading="lazy"
      />
    </div>

    <div>
      <img
        src="https://images.unsplash.com/photo-1518684079-48f57c0f0fe1"
        alt="Thành phố Đà Nẵng về đêm với những cây cầu rực sáng bên sông Hàn"
        loading="lazy"
      />
    </div>

    <p>
      Với hệ thống khách sạn, resort phong phú, dịch vụ du lịch phát triển, cùng con người thân thiện,
      Tour Đà Nẵng 3N2Đ là lựa chọn phù hợp cho những ai muốn vừa nghỉ ngơi thư giãn, vừa khám phá thêm
      vẻ đẹp của miền Trung Việt Nam.
    </p>
  `,

                information: `
    <h2>Information – Tour Đà Nẵng 3N2Đ</h2>

    <h3>1. Lịch trình chi tiết</h3>

    <h4>Ngày 1: Đến Đà Nẵng – Nhận phòng – Biển Mỹ Khê – City tour buổi tối</h4>
    <ul>
      <li>Đến sân bay Đà Nẵng, xe và hướng dẫn viên (nếu có) đón đoàn về khách sạn, nhận phòng và nghỉ ngơi.</li>
      <li>Buổi chiều tự do tắm biển Mỹ Khê, dạo bộ trên bờ biển, chụp hình check-in.</li>
      <li>Buổi tối có thể tham quan trung tâm thành phố, ngắm Cầu Rồng, Cầu Sông Hàn, dạo sông Hàn hoặc ghé chợ đêm/ khu ăn uống địa phương.</li>
      <li>Nghỉ đêm tại khách sạn ở Đà Nẵng.</li>
    </ul>

    <h4>Ngày 2: Bà Nà Hills – Cầu Vàng – Vui chơi giải trí</h4>
    <ul>
      <li>Sau bữa sáng, xe đưa đoàn đến Bà Nà Hills.</li>
      <li>Đi cáp treo lên Bà Nà, chiêm ngưỡng cảnh núi rừng hùng vĩ và khí hậu mát mẻ quanh năm.</li>
      <li>Tham quan Cầu Vàng, khu Làng Pháp, vườn hoa, hầm rượu và các công trình trong khu du lịch.</li>
      <li>Tự do vui chơi tại Fantasy Park (tùy gói vé), chụp ảnh, thưởng thức ẩm thực tại Bà Nà.</li>
      <li>Chiều về lại Đà Nẵng, nghỉ ngơi; tối tự do khám phá thành phố, thưởng thức đặc sản như mì Quảng, bún chả cá, hải sản.</li>
    </ul>

    <h4>Ngày 3: Ngũ Hành Sơn – Mua sắm – Kết thúc tour</h4>
    <ul>
      <li>Sau bữa sáng, trả phòng khách sạn (có thể gửi hành lý tại lễ tân nếu còn thời gian tham quan).</li>
      <li>Tham quan Ngũ Hành Sơn, làng đá mỹ nghệ Non Nước hoặc tự do mua sắm đặc sản Đà Nẵng (hải sản khô, chả bò... – tùy chương trình).</li>
      <li>Xe đưa đoàn ra sân bay Đà Nẵng, làm thủ tục lên chuyến bay về lại điểm xuất phát.</li>
      <li>Kết thúc tour Đà Nẵng 3N2Đ.</li>
    </ul>

    <h3>2. Dịch vụ bao gồm</h3>
    <ul>
      <li>Vé máy bay khứ hồi (nếu chọn gói bao gồm vé máy bay).</li>
      <li>Xe đưa đón sân bay – khách sạn – các điểm tham quan theo chương trình.</li>
      <li>02 đêm nghỉ tại khách sạn tiêu chuẩn 3–4* (phòng 2–3 khách/phòng).</li>
      <li>Bữa sáng hằng ngày tại khách sạn, các bữa chính theo chương trình (tùy gói tour).</li>
      <li>Vé tham quan các điểm du lịch theo lịch trình (trừ những dịch vụ ghi rõ là tự túc hoặc tùy chọn).</li>
      <li>Hướng dẫn viên du lịch (áp dụng cho chương trình ghép đoàn hoặc theo yêu cầu).</li>
      <li>Bảo hiểm du lịch theo quy định.</li>
    </ul>

    <h3>3. Không bao gồm</h3>
    <ul>
      <li>Chi phí cá nhân: giặt ủi, minibar, điện thoại, tip, chi tiêu ngoài chương trình.</li>
      <li>Đồ uống trong các bữa ăn, quán café, bar, dịch vụ vui chơi tính phí riêng.</li>
      <li>Phụ thu phòng đơn nếu khách ngủ riêng.</li>
      <li>Các hoạt động tự chọn: một số trò chơi tại Bà Nà Hills, show giải trí, dịch vụ spa, v.v.</li>
      <li>Thuế VAT (tùy chính sách từng thời điểm).</li>
    </ul>

    <h3>4. Địa điểm khởi hành & Bản đồ</h3>

    <p><strong>Khởi hành từ:</strong> Hà Nội, TP.HCM hoặc các thành phố khác (tùy gói tour).</p>
    <p><strong>Điểm đón phổ biến:</strong></p>
    <ul>
      <li>Sân bay Đà Nẵng (khi khách tự túc vé máy bay).</li>
      <li>Sân bay xuất phát (Nội Bài, Tân Sơn Nhất...) nếu chọn gói bao gồm vé máy bay và đón từ điểm hẹn.</li>
      <li>Văn phòng công ty du lịch (theo thông báo chi tiết khi đặt tour).</li>
    </ul>

    <p><strong>Bản đồ – Khu vực Đà Nẵng (tham khảo):</strong></p>

    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.6900616693615!2d108.20850840294108!3d16.059307772999986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a13%3A0xfc14e3a044436487!2zxJDDoCBO4bq1bmcsIEjhuqNpIENow6J1LCDEkMOgIE7hurVuZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1764487338003!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  `,

                address: "Thành phố Đà Nẵng, Việt Nam",
                basePrice: 5000000,
                discount: 10,
                createdBy: 1,
                categoryId: 1,
                locationId: 1,
            },

            {
                name: "Tour Phú Quốc 4N3Đ",
                description: `
    <h2>Giới thiệu Tour Phú Quốc 4N3Đ</h2>

    <p>
      Phú Quốc được mệnh danh là “đảo ngọc” của Việt Nam với bãi biển cát trắng mịn,
      làn nước trong xanh và hàng dừa chạy dài ven bờ. Khí hậu ôn hòa, biển êm và
      nhịp sống chậm rãi biến nơi đây thành điểm đến lý tưởng cho những chuyến nghỉ dưỡng
      dài ngày, trăng mật hay du lịch gia đình.
    </p>

    <p>
      Trong tour 4N3Đ, du khách sẽ có cơ hội khám phá những bãi biển đẹp nhất của Phú Quốc
      như Long Beach, Bãi Sao, quần đảo An Thới, trải nghiệm lặn ngắm san hô, đi cáp treo
      vượt biển, tham quan làng chài truyền thống và thưởng thức hải sản tươi sống tại
      chợ đêm nhộn nhịp.
    </p>

    <p>
      Bên cạnh thiên nhiên biển đảo, Phú Quốc còn hấp dẫn bởi văn hóa địa phương đặc trưng:
      xưởng nước mắm truyền thống, vườn tiêu xanh bạt ngàn, những quán cà phê, bar ven biển
      ngắm hoàng hôn. Tất cả tạo nên một hành trình vừa thư giãn, vừa tràn đầy trải nghiệm.
    </p>

    <img
      src="https://images.unsplash.com/[PHU_QUOC_BEACH_IMAGE_1]"
      alt="Toàn cảnh bãi biển Phú Quốc với cát trắng và nước biển trong xanh"
      loading="lazy"
    />

    <p>
      Hành trình được thiết kế cân bằng giữa tham quan và nghỉ ngơi: buổi sáng khám phá các điểm
      nổi bật, buổi chiều tự do tắm biển, buổi tối tận hưởng không khí sôi động tại khu resort
      hoặc dạo biển yên tĩnh. Đây là lựa chọn phù hợp cho nhóm bạn, gia đình có trẻ nhỏ hoặc các
      cặp đôi muốn tìm một nơi vừa đẹp vừa riêng tư.
    </p>

    <img
      src="https://images.unsplash.com/[PHU_QUOC_BEACH_IMAGE_2]"
      alt="Hoàng hôn trên biển Phú Quốc với cầu gỗ và hàng dừa"
      loading="lazy"
    />

    <img
      src="https://images.unsplash.com/[PHU_QUOC_BEACH_IMAGE_3]"
      alt="Quang cảnh biển đảo và hàng dừa ở Phú Quốc nhìn từ trên cao"
      loading="lazy"
    />

    <p>
      Với lợi thế đường bay thẳng từ nhiều thành phố lớn, hệ thống resort – khách sạn đa dạng
      từ 3* đến 5*, cùng dịch vụ du lịch ngày càng hoàn thiện, Tour Phú Quốc 4N3Đ hứa hẹn mang
      đến cho bạn một kỳ nghỉ trọn vẹn và nhiều kỷ niệm khó quên.
    </p>
  `,

                information: `
    <h2>Information – Tour Phú Quốc 4N3Đ</h2>

    <h3>1. Lịch trình chi tiết</h3>

    <h4>Ngày 1: Khởi hành – Đến Phú Quốc – Nhận phòng</h4>
    <ul>
      <li>Khởi hành từ Hà Nội hoặc TP.HCM (tùy điểm xuất phát bạn chọn khi đặt tour).</li>
      <li>Đến sân bay Phú Quốc, xe đón về khách sạn/resort, nhận phòng và nghỉ ngơi.</li>
      <li>Buổi chiều tự do tắm biển, dạo bờ cát hoặc thư giãn tại hồ bơi resort.</li>
      <li>Buổi tối dùng bữa tại khách sạn hoặc nhà hàng địa phương, tự do khám phá xung quanh.</li>
    </ul>

    <h4>Ngày 2: Tham quan Nam Đảo – Bãi Sao – Cáp treo/Hòn Thơm</h4>
    <ul>
      <li>Xe đưa đoàn tham quan khu Nam Đảo: cảng An Thới, làng chài, cơ sở nước mắm, vườn tiêu.</li>
      <li>Di chuyển đến Bãi Sao – một trong những bãi biển đẹp nhất Phú Quốc, tự do tắm biển, chụp hình.</li>
      <li>Tùy chương trình: trải nghiệm cáp treo vượt biển hoặc đi cano tham quan các hòn đảo nhỏ, lặn ngắm san hô.</li>
      <li>Chiều về lại khách sạn, nghỉ ngơi; tối có thể ghé chợ đêm Phú Quốc thưởng thức hải sản.</li>
    </ul>

    <h4>Ngày 3: Tham quan Bắc Đảo – Khu vui chơi/ Safari – Biển & hoàng hôn</h4>
    <ul>
      <li>Khởi hành đi Bắc Đảo: tham quan các điểm vui chơi, công viên chủ đề hoặc safari (tùy gói tour).</li>
      <li>Check-in tại những bãi biển, khu tổ hợp giải trí và các khu chụp hình ven biển.</li>
      <li>Chiều về lại khu nghỉ dưỡng, tự do tắm biển, ngắm hoàng hôn, tận hưởng tiện ích resort.</li>
      <li>Tối nghỉ ngơi hoặc tự do khám phá quán bar/café ven biển.</li>
    </ul>

    <h4>Ngày 4: Tự do mua sắm – Trả phòng – Về lại điểm xuất phát</h4>
    <ul>
      <li>Buổi sáng tự do tắm biển, mua sắm đặc sản (nước mắm, hồ tiêu, hải sản khô...).</li>
      <li>Trả phòng khách sạn, xe đưa ra sân bay Phú Quốc.</li>
      <li>Đáp chuyến bay về lại Hà Nội/TP.HCM, kết thúc tour.</li>
    </ul>

    <h3>2. Dịch vụ bao gồm</h3>
    <ul>
      <li>Vé máy bay khứ hồi (nếu chọn gói bao gồm vé máy bay).</li>
      <li>Xe đưa đón sân bay – khách sạn – điểm tham quan theo chương trình.</li>
      <li>03 đêm nghỉ tại khách sạn/resort tiêu chuẩn 3–5* (phòng 2–3 khách/phòng).</li>
      <li>Bữa sáng hằng ngày tại khách sạn và các bữa chính theo chương trình.</li>
      <li>Vé tham quan các điểm du lịch theo lịch trình.</li>
      <li>Hướng dẫn viên du lịch (áp dụng cho nhóm hoặc chương trình ghép đoàn).</li>
      <li>Bảo hiểm du lịch theo quy định.</li>
    </ul>

    <h3>3. Không bao gồm</h3>
    <ul>
      <li>Chi phí cá nhân: giặt ủi, minibar, điện thoại, tip, chi tiêu ngoài chương trình.</li>
      <li>Đồ uống trong các bữa ăn, bar, café, dịch vụ vui chơi tính phí riêng.</li>
      <li>Phụ thu phòng đơn (nếu khách ở 1 người/phòng).</li>
      <li>Các hoạt động tự chọn không nêu trong chương trình chi tiết.</li>
      <li>Thuế VAT (tùy chính sách từng thời điểm).</li>
    </ul>

    <h3>4. Địa điểm khởi hành & Bản đồ</h3>

    <p><strong>Khởi hành từ:</strong> Hà Nội hoặc TP.HCM (tùy lựa chọn gói tour).</p>
    <p><strong>Điểm đón phổ biến:</strong></p>
    <ul>
      <li>Sân bay Nội Bài (Hà Nội) hoặc Tân Sơn Nhất (TP.HCM).</li>
      <li>Văn phòng công ty du lịch (tùy theo chương trình cụ thể).</li>
    </ul>

    <p><strong>Bản đồ – Khu vực Phú Quốc (tham khảo):</strong></p>

    <iframe
      src="https://www.google.com/maps?q=Phu+Quoc+Island&output=embed"
      width="100%"
      height="350"
      style="border:0;"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  `,

                address: "Thành phố Phú Quốc, tỉnh Kiên Giang, Việt Nam",
                basePrice: 6500000,
                discount: 8,
                createdBy: 1,
                categoryId: 1,
                locationId: 3,
            },

            {
                name: "Tour Hà Nội - Ninh Bình",
                description: `
    <h2>Giới thiệu Tour Hà Nội - Ninh Bình</h2>

    <p>
      Ninh Bình – vùng đất sở hữu vẻ đẹp non nước hữu tình – được mệnh danh là “Hạ Long trên cạn”.
      Với những dãy núi đá vôi sừng sững, các dòng sông uốn lượn giữa những cánh đồng lúa xanh mướt
      và hệ thống hang động tự nhiên kỳ vĩ, nơi đây là điểm đến lý tưởng cho những ai muốn tìm sự
      bình yên và khám phá nét đẹp văn hóa – thiên nhiên của miền Bắc Việt Nam.
    </p>

    <p>
      Trong hành trình từ Hà Nội đến Ninh Bình, du khách sẽ lần lượt trải nghiệm các danh thắng nổi tiếng như
      <strong>Tràng An</strong>, <strong>Hoa Lư</strong>, <strong>Bái Đính</strong>, <strong>Hang Múa</strong>
      hoặc <strong>Tam Cốc</strong>. Bên cạnh cảnh quan hùng vĩ, Ninh Bình còn có bầu không khí trong lành,
      văn hóa lâu đời và ẩm thực đặc trưng, mang đến một chuyến đi vừa thư giãn, vừa giàu trải nghiệm.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[NINH_BINH_SCENIC_IMAGE_1]"
        alt="Toàn cảnh non nước Tràng An - Ninh Bình"
        loading="lazy"
      />
    </div>

    <p>
      Một trong những điểm nhấn của tour chính là ngồi thuyền dọc theo dòng sông Ngô Đồng hoặc tuyến Tràng An,
      len qua những vách núi đá vôi và hệ thống hang động tự nhiên đầy kỳ thú. Cảnh sắc thay đổi theo từng khúc
      sông, mang lại cảm giác yên bình, dễ chịu và cực kỳ “ăn ảnh”.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[NINH_BINH_BOAT_IMAGE_2]"
        alt="Thuyền chở du khách trên sông Ngô Đồng - Tam Cốc"
        loading="lazy"
      />
    </div>

    <p>
      Ninh Bình cũng là vùng đất giàu lịch sử với cố đô Hoa Lư – kinh đô đầu tiên của nhà nước phong kiến tập quyền.
      Những ngôi đền cổ kính, kiến trúc trầm mặc và không gian linh thiêng giúp du khách hiểu hơn về văn hóa dân tộc
      và dấu ấn của các triều đại xưa.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[NINH_BINH_TEMPLE_IMAGE_3]"
        alt="Đền thờ và kiến trúc cổ tại khu vực Hoa Lư"
        loading="lazy"
      />
    </div>

    <p>
      Với khoảng cách di chuyển thuận tiện từ Hà Nội, cảnh đẹp đa dạng và dịch vụ du lịch ngày càng phát triển,
      Tour Hà Nội – Ninh Bình là lựa chọn tuyệt vời cho chuyến đi 1–2 ngày dành cho gia đình, nhóm bạn hoặc khách quốc tế.
    </p>
  `,

                information: `
    <h2>Information – Tour Hà Nội - Ninh Bình</h2>

    <h3>1. Lịch trình chi tiết</h3>

    <h4>Ngày 1: Hà Nội – Ninh Bình – Tràng An/Tam Cốc – Hang Múa</h4>
    <ul>
      <li>Xe đón khách tại khu vực Phố Cổ hoặc điểm hẹn trong nội thành Hà Nội.</li>
      <li>Di chuyển đến Ninh Bình, nghỉ ngơi tại trạm dừng chân.</li>
      <li>Tham quan Tràng An hoặc Tam Cốc – ngồi thuyền ngắm cảnh non nước hữu tình.</li>
      <li>Dùng bữa trưa với đặc sản dê núi Ninh Bình.</li>
      <li>Buổi chiều tham quan Hang Múa, chinh phục 486 bậc đá để ngắm toàn cảnh Tam Cốc từ trên cao.</li>
      <li>Nhận phòng khách sạn nghỉ ngơi hoặc tự do dạo phố buổi tối.</li>
    </ul>

    <h4>Ngày 2: Bái Đính – Cố đô Hoa Lư – Hà Nội</h4>
    <ul>
      <li>Buổi sáng ăn sáng tại khách sạn.</li>
      <li>Tham quan chùa Bái Đính – quần thể chùa lớn nhất Việt Nam, nổi tiếng với kiến trúc hoành tráng.</li>
      <li>Di chuyển đến Cố đô Hoa Lư – nơi gắn với triều Đinh và Tiền Lê.</li>
      <li>Dùng bữa trưa và tự do mua đặc sản mang về.</li>
      <li>Xe đưa đoàn trở lại Hà Nội, kết thúc tour.</li>
    </ul>

    <h3>2. Dịch vụ bao gồm</h3>
    <ul>
      <li>Xe du lịch đưa đón Hà Nội – Ninh Bình – Hà Nội.</li>
      <li>1 đêm khách sạn tại Ninh Bình (phòng 2–3 khách/phòng).</li>
      <li>Ăn sáng + 2 bữa trưa theo chương trình.</li>
      <li>Vé tham quan các điểm du lịch trong lịch trình.</li>
      <li>Thuyền Tràng An/Tam Cốc.</li>
      <li>Hướng dẫn viên theo đoàn.</li>
      <li>Bảo hiểm du lịch.</li>
    </ul>

    <h3>3. Không bao gồm</h3>
    <ul>
      <li>Đồ uống và chi phí cá nhân.</li>
      <li>Phụ thu phòng đơn (nếu khách ở một mình).</li>
      <li>Các dịch vụ tự chọn ngoài chương trình.</li>
      <li>Thuế VAT.</li>
    </ul>

    <h3>4. Địa điểm khởi hành & Bản đồ</h3>

    <p><strong>Khởi hành từ:</strong> Hà Nội</p>
    <p><strong>Điểm đón phổ biến:</strong></p>
    <ul>
      <li>Khu vực Phố Cổ (Hoàn Kiếm)</li>
      <li>Nhà hát Lớn Hà Nội</li>
      <li>Địa điểm hẹn theo yêu cầu</li>
    </ul>

    <p><strong>Bản đồ – Khu vực Ninh Bình (tham khảo):</strong></p>

    <iframe
      src="https://www.google.com/maps?q=Ninh+Binh+Vietnam&output=embed"
      width="100%"
      height="350"
      style="border:0;"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  `,

                address: "Ninh Bình, Việt Nam",
                basePrice: 5000000,
                discount: 10,
                createdBy: 1,
                categoryId: 1,
                locationId: 2,
            },

            {
                name: "Tour Huế - Hội An",
                description: `
    <h2>Giới thiệu Tour Huế - Hội An</h2>

    <p>
      Huế và Hội An là hai điểm đến mang đậm dấu ấn văn hóa, lịch sử và kiến trúc cổ kính bậc nhất miền Trung.
      Nếu Huế gợi cảm giác trầm mặc với những cung điện, lăng tẩm và dòng sông Hương thơ mộng, thì Hội An lại
      cuốn hút du khách bằng phố cổ lung linh ánh đèn lồng, những mái nhà rêu phong và dòng Hoài yên bình.
    </p>

    <p>
      Tour Huế – Hội An mang đến hành trình hòa quyện giữa vẻ đẹp cổ kính và nét thơ mộng đặc trưng của miền Trung.
      Du khách sẽ có cơ hội khám phá Đại Nội, tham quan chùa Thiên Mụ, dạo bước tại phố cổ Hội An, thưởng thức những
      món ăn địa phương như bún bò Huế, cơm hến, cao lầu, mì Quảng và tận hưởng nhịp sống chậm rãi nơi đây.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[HUE_CITADEL_IMAGE_1]"
        alt="Toàn cảnh Đại Nội Huế với kiến trúc cung đình cổ"
        loading="lazy"
      />
    </div>

    <p>
      Mỗi địa danh trong tour đều mang dấu ấn lịch sử và vẻ đẹp riêng: kiến trúc cung đình Huế uy nghi trầm mặc,
      dòng sông Hương nhẹ nhàng chảy qua lòng thành phố, những con phố vàng Hội An in đậm dấu thời gian, và những
      dãy đèn lồng nhiều màu sắc tạo nên một bức tranh lãng mạn khi màn đêm buông xuống.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[HOI_AN_LANTERN_IMAGE_2]"
        alt="Phố cổ Hội An lung linh ánh đèn lồng về đêm"
        loading="lazy"
      />
    </div>

    <p>
      Với sự kết hợp hoàn hảo giữa văn hóa, kiến trúc, lịch sử và ẩm thực, Tour Huế – Hội An mang đến cho du khách
      trải nghiệm nhẹ nhàng nhưng vô cùng sâu sắc. Đây là lựa chọn tuyệt vời cho những ai yêu thích khám phá truyền thống,
      đắm mình trong không gian hoài cổ và tìm kiếm sự bình yên trong chuyến đi.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[HOI_AN_RIVER_IMAGE_3]"
        alt="Dòng sông Hoài và những chiếc thuyền nhỏ tại Hội An"
        loading="lazy"
      />
    </div>
  `,

                information: `
    <h2>Information – Tour Huế - Hội An</h2>

    <h3>1. Lịch trình chi tiết</h3>

    <h4>Ngày 1: Đến Huế – Đại Nội – Chùa Thiên Mụ – Sông Hương</h4>
    <ul>
      <li>Đến Huế, xe đón khách tại sân bay hoặc ga Huế.</li>
      <li>Tham quan Đại Nội – Hoàng thành Huế, nơi lưu giữ kiến trúc cung đình triều Nguyễn.</li>
      <li>Dùng bữa trưa với đặc sản Huế (bún bò, cơm hến, bánh bèo – tùy chương trình).</li>
      <li>Buổi chiều tham quan chùa Thiên Mụ, nằm bên sông Hương.</li>
      <li>Buổi tối tự do dạo phố đi bộ, ngắm cầu Trường Tiền và thưởng thức chè Huế.</li>
    </ul>

    <h4>Ngày 2: Lăng Tự Đức – Di chuyển đến Hội An – Phố cổ về đêm</h4>
    <ul>
      <li>Buổi sáng tham quan Lăng Tự Đức hoặc Lăng Minh Mạng (tùy chương trình).</li>
      <li>Khởi hành đi Hội An, nhận phòng khách sạn.</li>
      <li>Buổi tối khám phá phố cổ Hội An, dạo chợ đêm, thả hoa đăng trên sông Hoài.</li>
    </ul>

    <h4>Ngày 3: Hội An – Chùa Cầu – Mua sắm – Trả khách</h4>
    <ul>
      <li>Tham quan Chùa Cầu, những ngôi nhà cổ và các tuyến phố đặc trưng của Hội An.</li>
      <li>Mua sắm đặc sản: đèn lồng, đồ thủ công mỹ nghệ, bánh đậu xanh, bánh tổ…</li>
      <li>Trả phòng, xe đưa khách về lại Đà Nẵng hoặc Huế để ra sân bay/ga.</li>
    </ul>

    <h3>2. Dịch vụ bao gồm</h3>
    <ul>
      <li>Xe du lịch đưa đón theo chương trình.</li>
      <li>02 đêm khách sạn tại Huế và Hội An (phòng 2–3 khách/phòng).</li>
      <li>Ăn sáng tại khách sạn + các bữa trong chương trình.</li>
      <li>Vé tham quan các điểm du lịch theo lịch trình.</li>
      <li>Hướng dẫn viên chuyên nghiệp.</li>
      <li>Bảo hiểm du lịch.</li>
    </ul>

    <h3>3. Không bao gồm</h3>
    <ul>
      <li>Đồ uống và chi phí cá nhân.</li>
      <li>Phụ thu phòng đơn nếu khách ở 1 mình.</li>
      <li>Dịch vụ tự chọn ngoài chương trình.</li>
      <li>Thuế VAT.</li>
    </ul>

    <h3>4. Địa điểm khởi hành & Bản đồ</h3>

    <p><strong>Khởi hành từ:</strong> Huế hoặc Đà Nẵng (tùy chương trình bạn chọn).</p>
    <p><strong>Điểm đón phổ biến:</strong></p>
    <ul>
      <li>Sân bay Phú Bài (Huế)</li>
      <li>Ga Huế</li>
      <li>Khách sạn trong trung tâm Huế</li>
      <li>Tại Hội An, đón tại khách sạn khu vực phố cổ</li>
    </ul>

    <p><strong>Bản đồ – Khu vực Hội An & Huế (tham khảo):</strong></p>

    <iframe
      src="https://www.google.com/maps?q=Hue+and+Hoi+An+Vietnam&output=embed"
      width="100%"
      height="350"
      style="border:0;"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  `,

                address: "Huế – Hội An, Miền Trung Việt Nam",
                basePrice: 4000000,
                discount: 7,
                createdBy: 1,
                categoryId: 2,
                locationId: 4,
            },

            {
                name: "Tour Sapa 3N2Đ",
                description: `
    <h2>Giới thiệu Tour Sapa 3N2Đ</h2>

    <p>
      Sapa là điểm đến nổi tiếng với khí hậu mát mẻ quanh năm, những dãy núi hùng vĩ, ruộng bậc thang trải dài
      đẹp như tranh vẽ và bản làng mang đậm bản sắc văn hóa của đồng bào dân tộc vùng cao. Không chỉ có cảnh đẹp,
      Sapa còn cuốn hút bởi nhịp sống yên bình, giản dị cùng nhiều trải nghiệm thú vị dành cho du khách.
    </p>

    <p>
      Tour Sapa 3N2Đ mang đến hành trình kết hợp giữa khám phá thiên nhiên, chinh phục đỉnh núi và tìm hiểu văn hóa
      bản địa. Du khách sẽ được ngắm nhìn quang cảnh ruộng bậc thang từ trên cao, tham quan núi Hàm Rồng, Fansipan –
      “nóc nhà Đông Dương”, cùng dạo bước qua những bản làng thơ mộng như Cát Cát, Tả Van hoặc Lao Chải.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[SAPA_MOUNTAIN_VIEW_1]"
        alt="Khung cảnh ruộng bậc thang và núi đồi Sapa từ trên cao"
        loading="lazy"
      />
    </div>

    <p>
      Sapa cũng là nơi lý tưởng để hòa mình vào thiên nhiên trong lành, tận hưởng khí mát vùng cao và cảm nhận sự
      đối lập thú vị giữa ngày nắng nhẹ và đêm se lạnh. Các phiên chợ vùng cao, nhà gỗ truyền thống và ẩm thực độc đáo
      như thắng cố, lợn bản nướng, cá suối… đều đem lại những trải nghiệm khó quên.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[SAPA_CAT_CAT_VILLAGE_2]"
        alt="Bản Cát Cát với những ngôi nhà gỗ và cảnh núi đồi Sapa"
        loading="lazy"
      />
    </div>

    <p>
      Với cảnh sắc thiên nhiên tuyệt đẹp, văn hóa đa dạng và vô số trải nghiệm hấp dẫn, Tour Sapa 3N2Đ phù hợp cho
      gia đình, cặp đôi hoặc nhóm bạn muốn tận hưởng một chuyến đi vừa thư giãn vừa đậm chất khám phá.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[SAPA_FANSIPAN_3]"
        alt="Đỉnh Fansipan hùng vĩ giữa biển mây"
        loading="lazy"
      />
    </div>
  `,

                information: `
    <h2>Information – Tour Sapa 3N2Đ</h2>

    <h3>1. Lịch trình chi tiết</h3>

    <h4>Ngày 1: Hà Nội – Sapa – Núi Hàm Rồng</h4>
    <ul>
      <li>Xe đón khách tại Hà Nội và khởi hành đi Sapa.</li>
      <li>Đến Sapa, nhận phòng khách sạn và nghỉ ngơi.</li>
      <li>Buổi chiều tham quan Núi Hàm Rồng, ngắm toàn cảnh thị trấn Sapa từ trên cao.</li>
      <li>Buổi tối tự do dạo phố, thưởng thức đồ nướng và đặc sản vùng cao.</li>
    </ul>

    <h4>Ngày 2: Fansipan – Bản Cát Cát</h4>
    <ul>
      <li>Buổi sáng đi cáp treo chinh phục đỉnh Fansipan – nóc nhà Đông Dương.</li>
      <li>Chiêm ngưỡng quang cảnh mây núi hùng vĩ và chụp ảnh check-in.</li>
      <li>Buổi chiều tham quan bản Cát Cát – tìm hiểu văn hóa dân tộc H’Mông.</li>
      <li>Tối về lại khách sạn nghỉ ngơi hoặc tự do khám phá.</li>
    </ul>

    <h4>Ngày 3: Thung lũng Mường Hoa – Trở về Hà Nội</h4>
    <ul>
      <li>Buổi sáng đi tham quan thung lũng Mường Hoa hoặc Lao Chải – Tả Van (tùy chương trình).</li>
      <li>Dùng bữa trưa tại Sapa, sau đó trả phòng.</li>
      <li>Xe đưa đoàn về lại Hà Nội, kết thúc tour.</li>
    </ul>

    <h3>2. Dịch vụ bao gồm</h3>
    <ul>
      <li>Xe giường nằm/xe du lịch cao cấp đưa đón Hà Nội – Sapa – Hà Nội.</li>
      <li>02 đêm khách sạn tại Sapa (phòng 2–3 khách/phòng).</li>
      <li>Ăn sáng hằng ngày + các bữa chính theo chương trình.</li>
      <li>Vé tham quan các điểm du lịch trong lịch trình.</li>
      <li>Vé cáp treo Fansipan (nếu bao gồm trong gói tour).</li>
      <li>Hướng dẫn viên theo đoàn.</li>
      <li>Bảo hiểm du lịch.</li>
    </ul>

    <h3>3. Không bao gồm</h3>
    <ul>
      <li>Đồ uống và chi phí cá nhân.</li>
      <li>Phụ thu phòng đơn.</li>
      <li>Vé cáp treo Fansipan (nếu không nằm trong gói bạn chọn).</li>
      <li>Các dịch vụ tự chọn ngoài chương trình.</li>
      <li>Thuế VAT.</li>
    </ul>

    <h3>4. Địa điểm khởi hành & Bản đồ</h3>

    <p><strong>Khởi hành từ:</strong> Hà Nội</p>
    <p><strong>Điểm đón phổ biến:</strong></p>
    <ul>
      <li>Khu vực Phố Cổ Hà Nội</li>
      <li>Nhà hát Lớn Hà Nội</li>
      <li>Điểm hẹn riêng theo yêu cầu</li>
    </ul>

    <p><strong>Bản đồ – Khu vực Sapa (tham khảo):</strong></p>

    <iframe
      src="https://www.google.com/maps?q=Sapa+Vietnam&output=embed"
      width="100%"
      height="350"
      style="border:0;"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  `,

                address: "Thị trấn Sapa, tỉnh Lào Cai, Việt Nam",
                basePrice: 4800000,
                discount: 12,
                createdBy: 1,
                categoryId: 4,
                locationId: 7,
            },

            {
                name: "Tour Hạ Long 2N1Đ",
                description: `
    <h2>Giới thiệu Tour Hạ Long 2N1Đ</h2>

    <p>
      Vịnh Hạ Long là một trong những kỳ quan thiên nhiên đẹp nhất của Việt Nam, được UNESCO công nhận
      là Di sản Thiên nhiên Thế giới. Nơi đây nổi bật với hàng nghìn đảo đá vôi lớn nhỏ mọc lên giữa làn nước
      xanh ngọc bích, tạo nên một bức tranh thiên nhiên hùng vĩ và thơ mộng hiếm có.
    </p>

    <p>
      Tour Hạ Long 2N1Đ mang đến cho du khách cơ hội trải nghiệm du thuyền, khám phá các hang động nổi tiếng,
      tham quan những hòn đảo biểu tượng và tận hưởng không khí biển trong lành. Bên cạnh đó, du khách còn
      được thưởng thức hải sản tươi sống, chèo kayak, tắm biển và ngắm hoàng hôn tuyệt đẹp trên vịnh.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[HALONG_SCENERY_IMAGE_1]"
        alt="Toàn cảnh vịnh Hạ Long với nước xanh và núi đá vôi"
        loading="lazy"
      />
    </div>

    <p>
      Trong hành trình, bạn sẽ có cơ hội chiêm ngưỡng những địa điểm nổi bật như Động Thiên Cung,
      Hang Đầu Gỗ, Hòn Gà Chọi, và nhiều đảo đá mang hình thù độc đáo khác. Mỗi góc nhìn tại Hạ Long đều
      đem đến cảm giác yên bình nhưng không kém phần kỳ thú.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[HALONG_BOAT_IMAGE_2]"
        alt="Thuyền du lịch trên vịnh Hạ Long"
        loading="lazy"
      />
    </div>

    <p>
      Với sự kết hợp giữa cảnh quan biển đảo tuyệt đẹp, dịch vụ du thuyền sang trọng và các hoạt động trải nghiệm
      hấp dẫn, Tour Hạ Long 2N1Đ phù hợp cho gia đình, nhóm bạn, cặp đôi hoặc khách quốc tế muốn khám phá vẻ đẹp
      đặc sắc của miền Bắc Việt Nam.
    </p>

    <div>
      <img
        src="https://images.unsplash.com/[HALONG_CAVE_IMAGE_3]"
        alt="Bên trong một hang động nổi tiếng tại Hạ Long"
        loading="lazy"
      />
    </div>
  `,

                information: `
    <h2>Information – Tour Hạ Long 2N1Đ</h2>

    <h3>1. Lịch trình chi tiết</h3>

    <h4>Ngày 1: Hà Nội – Hạ Long – Tham quan Vịnh</h4>
    <ul>
      <li>Xe đón khách tại Hà Nội và khởi hành đi Hạ Long.</li>
      <li>Đến bến tàu, làm thủ tục lên du thuyền và dùng bữa trưa trên tàu.</li>
      <li>Tham quan Động Thiên Cung hoặc Hang Sửng Sốt tùy chương trình.</li>
      <li>Trải nghiệm chèo kayak, tắm biển hoặc chụp hình check-in trên boong tàu.</li>
      <li>Buổi tối dùng bữa tại nhà hàng trên tàu, tham gia câu mực đêm hoặc nghỉ ngơi tự do.</li>
    </ul>

    <h4>Ngày 2: Làng Ngọc Trai – Trả khách – Hà Nội</h4>
    <ul>
      <li>Ngắm bình minh trên vịnh và dùng bữa sáng.</li>
      <li>Tham quan Làng Ngọc Trai – tìm hiểu quy trình nuôi cấy ngọc.</li>
      <li>Trả phòng, du thuyền đưa khách về bến.</li>
      <li>Xe đưa đoàn trở lại Hà Nội, kết thúc tour.</li>
    </ul>

    <h3>2. Dịch vụ bao gồm</h3>
    <ul>
      <li>Xe du lịch đưa đón Hà Nội – Hạ Long – Hà Nội.</li>
      <li>01 đêm nghỉ trên du thuyền hoặc khách sạn 3–5* (tùy gói).</li>
      <li>01 bữa sáng + 02 bữa chính.</li>
      <li>Vé tham quan các điểm du lịch theo chương trình.</li>
      <li>Chèo kayak hoặc thuyền nan (tùy tour).</li>
      <li>Hướng dẫn viên theo đoàn.</li>
      <li>Bảo hiểm du lịch.</li>
    </ul>

    <h3>3. Không bao gồm</h3>
    <ul>
      <li>Đồ uống và chi phí cá nhân.</li>
      <li>Phụ thu phòng đơn nếu có.</li>
      <li>Các dịch vụ tự chọn ngoài chương trình.</li>
      <li>Thuế VAT.</li>
    </ul>

    <h3>4. Địa điểm khởi hành & Bản đồ</h3>

    <p><strong>Khởi hành từ:</strong> Hà Nội</p>
    <p><strong>Điểm đón phổ biến:</strong></p>
    <ul>
      <li>Khu vực Phố Cổ Hà Nội</li>
      <li>Nhà hát Lớn Hà Nội</li>
      <li>Điểm hẹn riêng theo thông báo</li>
    </ul>

    <p><strong>Bản đồ – Khu vực Hạ Long (tham khảo):</strong></p>

    <iframe
      src="https://www.google.com/maps?q=Ha+Long+Bay&output=embed"
      width="100%"
      height="350"
      style="border:0;"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  `,

                address: "Thành phố Hạ Long, tỉnh Quảng Ninh, Việt Nam",
                basePrice: 4200000,
                discount: 6,
                createdBy: 1,
                categoryId: 4,
                locationId: 8,
            },
        ],
    });

    await prisma.tourImage.createMany({
        data: [
            { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", position: 0, tourId: 1 },
            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", position: 1, tourId: 1 },
            { url: "https://images.unsplash.com/photo-1518684079-48f57c0f0fe1", position: 2, tourId: 1 },
            { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", position: 3, tourId: 1 },
            { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", position: 4, tourId: 1 },

            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", position: 0, tourId: 2 },
            { url: "https://images.unsplash.com/photo-1501959915551-4e8a04a1e4c2", position: 1, tourId: 2 },
            { url: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", position: 2, tourId: 2 },
            { url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef", position: 3, tourId: 2 },
            { url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21", position: 4, tourId: 2 },

            { url: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a8", position: 0, tourId: 3 },
            { url: "https://images.unsplash.com/photo-1524492449096-2eec6a34e4e7", position: 1, tourId: 3 },
            { url: "https://images.unsplash.com/photo-1500534623283-312aade485b7", position: 2, tourId: 3 },
            { url: "https://images.unsplash.com/photo-1502920917128-1aa500764b8a", position: 3, tourId: 3 },
            { url: "https://images.unsplash.com/photo-1584956862690-1d8a1966e6c8", position: 4, tourId: 3 },

            { url: "https://images.unsplash.com/photo-1518684079-48f57c0f0fe1", position: 0, tourId: 4 },
            { url: "https://images.unsplash.com/photo-1584956862690-1d8a1966e6c8", position: 1, tourId: 4 },
            { url: "https://images.unsplash.com/photo-1602746473848-9f3f9c9f9093", position: 2, tourId: 4 },
            { url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef", position: 3, tourId: 4 },
            { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", position: 4, tourId: 4 },

            { url: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b", position: 0, tourId: 5 },
            { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", position: 1, tourId: 5 },
            { url: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", position: 2, tourId: 5 },
            { url: "https://images.unsplash.com/photo-1500534623283-312aade485b7", position: 3, tourId: 5 },
            { url: "https://images.unsplash.com/photo-1502920917128-1aa500764b8a", position: 4, tourId: 5 },

            { url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21", position: 0, tourId: 6 },
            { url: "https://images.unsplash.com/photo-1473959383417-4c5bd1b5b740", position: 1, tourId: 6 },
            { url: "https://images.unsplash.com/photo-1501959915551-4e8a04a1e4c2", position: 2, tourId: 6 },
            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", position: 3, tourId: 6 },
            { url: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a8", position: 4, tourId: 6 },
        ],
    });

    await prisma.tourDeparture.createMany({
        data: [
            { departure: new Date("2025-01-05T08:00:00"), price: 5500000, capacity: 30, availableSeats: 30, tourId: 1 },
            { departure: new Date("2025-01-12T08:00:00"), price: 5500000, capacity: 30, availableSeats: 30, tourId: 1 },
            { departure: new Date("2025-01-19T08:00:00"), price: 5500000, capacity: 30, availableSeats: 30, tourId: 1 },
            { departure: new Date("2025-01-26T08:00:00"), price: 5600000, capacity: 30, availableSeats: 30, tourId: 1 },
            { departure: new Date("2025-02-02T08:00:00"), price: 5600000, capacity: 30, availableSeats: 30, tourId: 1 },

            { departure: new Date("2025-01-07T08:00:00"), price: 6700000, capacity: 30, availableSeats: 30, tourId: 2 },
            { departure: new Date("2025-01-14T08:00:00"), price: 6700000, capacity: 30, availableSeats: 30, tourId: 2 },
            { departure: new Date("2025-01-21T08:00:00"), price: 6800000, capacity: 30, availableSeats: 30, tourId: 2 },
            { departure: new Date("2025-01-28T08:00:00"), price: 6800000, capacity: 30, availableSeats: 30, tourId: 2 },
            { departure: new Date("2025-02-04T08:00:00"), price: 6900000, capacity: 30, availableSeats: 30, tourId: 2 },

            { departure: new Date("2025-01-03T07:30:00"), price: 3600000, capacity: 30, availableSeats: 30, tourId: 3 },
            { departure: new Date("2025-01-10T07:30:00"), price: 3600000, capacity: 30, availableSeats: 30, tourId: 3 },
            { departure: new Date("2025-01-17T07:30:00"), price: 3700000, capacity: 30, availableSeats: 30, tourId: 3 },
            { departure: new Date("2025-01-24T07:30:00"), price: 3700000, capacity: 30, availableSeats: 30, tourId: 3 },
            { departure: new Date("2025-01-31T07:30:00"), price: 3800000, capacity: 30, availableSeats: 30, tourId: 3 },

            { departure: new Date("2025-01-06T08:00:00"), price: 4200000, capacity: 30, availableSeats: 30, tourId: 4 },
            { departure: new Date("2025-01-13T08:00:00"), price: 4200000, capacity: 30, availableSeats: 30, tourId: 4 },
            { departure: new Date("2025-01-20T08:00:00"), price: 4300000, capacity: 30, availableSeats: 30, tourId: 4 },
            { departure: new Date("2025-01-27T08:00:00"), price: 4300000, capacity: 30, availableSeats: 30, tourId: 4 },
            { departure: new Date("2025-02-03T08:00:00"), price: 4400000, capacity: 30, availableSeats: 30, tourId: 4 },

            { departure: new Date("2025-01-04T06:30:00"), price: 5000000, capacity: 30, availableSeats: 30, tourId: 5 },
            { departure: new Date("2025-01-11T06:30:00"), price: 5000000, capacity: 30, availableSeats: 30, tourId: 5 },
            { departure: new Date("2025-01-18T06:30:00"), price: 5100000, capacity: 30, availableSeats: 30, tourId: 5 },
            { departure: new Date("2025-01-25T06:30:00"), price: 5100000, capacity: 30, availableSeats: 30, tourId: 5 },
            { departure: new Date("2025-02-01T06:30:00"), price: 5200000, capacity: 30, availableSeats: 30, tourId: 5 },

            { departure: new Date("2025-01-02T09:00:00"), price: 4500000, capacity: 30, availableSeats: 30, tourId: 6 },
            { departure: new Date("2025-01-09T09:00:00"), price: 4500000, capacity: 30, availableSeats: 30, tourId: 6 },
            { departure: new Date("2025-01-16T09:00:00"), price: 4600000, capacity: 30, availableSeats: 30, tourId: 6 },
            { departure: new Date("2025-01-23T09:00:00"), price: 4600000, capacity: 30, availableSeats: 30, tourId: 6 },
            { departure: new Date("2025-01-30T09:00:00"), price: 4700000, capacity: 30, availableSeats: 30, tourId: 6 },
        ],
    });

    // const order = await prisma.order.create({
    //     data: {
    //         status: OrderStatus.PAID,
    //         totalAmount: 11_000_000,
    //         userId: user.id,
    //     },
    // });

    // await prisma.orderItem.create({
    //     data: {
    //         quantity: 2,
    //         unitPrice: 5_500_000,
    //         totalPrice: 11_000_000,
    //         orderId: order.id,
    //         tourDepartureId: 1,
    //     },
    // });

    // await prisma.payment.create({
    //     data: {
    //         amount: 11_000_000,
    //         status: PaymentStatus.SUCCESS,
    //         method: PaymentMethod.CASH,
    //         orderId: order.id,
    //         userId: user.id,
    //     },
    // });

    // await prisma.review.create({
    //     data: {
    //         rating: 5,
    //         comment: "Tour rất tuyệt vời!",
    //         tourId: tour.id,
    //         userId: user.id,
    //     },
    // });
    await prisma.promotion.createMany({
        data: [
            {
                discount: 10,
                amount: 0,
                code: "NEW10",
                type: "NEW",
                name: "Khách mới giảm 10%",
                description: "Giảm 10% cho khách hàng đăng ký mới lần đầu đặt tour.",
                startAt: new Date("2025-01-01T00:00:00"),
                endAt: new Date("2025-12-31T23:59:59"),
            },
            {
                discount: 15,
                amount: 0,
                code: "WELCOME15",
                type: "NEW",
                name: "Ưu đãi khách mới 15%",
                description: "Áp dụng cho khách mới khi đặt tour bất kỳ.",
                startAt: new Date("2025-02-01T00:00:00"),
                endAt: new Date("2025-03-31T23:59:59"),
            },
            {
                discount: 0,
                amount: 500000,
                code: "ALL500K",
                type: "ALL",
                name: "Giảm 500K toàn hệ thống",
                description: "Giảm 500.000₫ cho mọi khách hàng khi đặt tour.",
                startAt: new Date("2025-01-15T00:00:00"),
                endAt: new Date("2025-04-15T23:59:59"),
            },
            {
                discount: 20,
                amount: 0,
                code: "SALE20",
                type: "ALL",
                name: "Giảm 20% toàn bộ tour",
                description: "Giảm sâu 20% dành cho tất cả khách hàng.",
                startAt: new Date("2025-03-01T00:00:00"),
                endAt: new Date("2025-03-15T23:59:59"),
            },
            {
                discount: 0,
                amount: 1000000,
                code: "VIP1M",
                type: "ALL",
                name: "Giảm 1 triệu",
                description: "Áp dụng cho đơn từ 8 triệu trở lên.",
                startAt: new Date("2025-01-01T00:00:00"),
                endAt: new Date("2025-12-31T23:59:59"),
            },
        ],
    });
    await prisma.tourFavorited.createMany({
        data: [
            { userId: 1, tourId: 2 },
            { userId: 1, tourId: 3 },
            { userId: 2, tourId: 1 },
        ],
        skipDuplicates: true, 
    });

    await prisma.promotionUser.createMany({
        data: [
            { userId: 1, promotionId: 1 },
            { userId: 1, promotionId: 3 },
            { userId: 2, promotionId: 2 },
        ],
        skipDuplicates: true, 
    });

    await prisma.order.create({
        data: {
            id: 1,
            userId: 1,
            status: OrderStatus.PENDING,
            items: {
                create: [
                    {
                        quantity: 1,
                        unitPrice: 2000,
                        tourDepartureId: 1
                    }
                ]
            }
        }
    });

    console.log("DONE");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        prisma.$disconnect();
    });
