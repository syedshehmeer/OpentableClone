import { PrismaClient } from "@prisma/client";
import Menu from "../components/Menu";
import RestaurantNavBar from "../components/RestaurantNavBar";

const prisma = new PrismaClient();

const fetchRestaurantMenu = async (slug: string) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        items: true,
      },
    });

    if (!restaurant) {
      throw new Error(`Restaurant with slug '${slug}' not found`);
    }

    return restaurant.items;
  } catch (error) {
    // Handle the error gracefully, e.g., log it or display an error message.
    console.error("Error fetching restaurant menu:", error);
    throw error; // Rethrow the error to propagate it to the component.
  }
};

export default async function RestaurantMenu({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const menu = await fetchRestaurantMenu(params.slug);

    return (
      <>
        <div className="bg-white w-[100%] rounded p-3 shadow">
          <RestaurantNavBar slug={params.slug} />
          <Menu menu={menu} />
        </div>
      </>
    );
  } catch (error) {
    // Handle the error gracefully, e.g., display an error page or message.
    console.error("Error rendering restaurant menu page:", error);
    // You can render an error message or a custom error page here.
    return <div>Error: Unable to fetch restaurant menu.</div>;
  }
}
