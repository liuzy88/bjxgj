import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class Main {
    public static void main(String[] args) {
        if (args.length != 2) {
            System.out.println("params error !");
            return;
        }
        File src = new File(args[0]);
        File dst = new File(args[1]);
        if (!src.exists()) {
            System.out.println("src not found !" + src.getPath());
            return;
        }

        try (FileOutputStream fos = new FileOutputStream(dst)) {
            loadFont();

            System.out.println("src: " + src.getCanonicalPath());
            System.out.println("dst: " + dst.getCanonicalPath());

            Image img = ImageIO.read(src);
            int width = img.getWidth(null);
            int height = img.getHeight(null);
            System.out.printf("src => %d x %d\r\n", width, height);
            if (width != 750 || height != 1334) {
                System.out.println("src error must 750x1334 !");
            }

            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MINUTE, -3);
            calendar.add(Calendar.SECOND, (int) (Math.random() * (100 - 30 + 1) + 30) * -1);
            Date d = calendar.getTime();
            String time = new SimpleDateFormat("HH:mm").format(d);
            String date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(d);
            BufferedImage bi = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = bi.createGraphics();
            g.drawImage(img, 0, 0, width, height, null);

            g.setColor(new Color(255, 255, 255));
            g.fillRect(338, 8, 74, 26);
            g.fillRect(287, 613, 282, 36);

            g.setColor(new Color(0, 0, 0));
            g.setFont(new Font("Microsoft Yahei", Font.BOLD, 24));
            g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB);
            g.drawString(time, 340, 30);

            g.setColor(new Color(155, 155, 155));
            g.setFont(new Font("微软雅黑 Light", Font.BOLD, 26));
            g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB);
            g.drawString(date, 298, 640);

            g.dispose();
            ImageIO.write(bi, "png", fos);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void loadFont() {
        try {
            Font msyh = Font.createFont(Font.TRUETYPE_FONT, new File("msyhl.ttc"));
            GraphicsEnvironment.getLocalGraphicsEnvironment().registerFont(msyh);
        } catch (Exception e) {
            System.out.println("load msyh.ttc font error, " + e.getMessage());
        }
    }
}
