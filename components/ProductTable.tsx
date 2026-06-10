import { Product } from "@prisma/client";
import { dollars } from "@/lib/orders";
import { productUrl } from "@/lib/seo";

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="comparison">
      <table>
        <thead>
          <tr>
            <th>Product name</th>
            <th>Validation type</th>
            <th>Domains covered</th>
            <th>Issuance time</th>
            <th>Price</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td><strong>{product.name}</strong></td>
              <td>{product.validationType}</td>
              <td>{product.domainsCovered}</td>
              <td>{product.issuanceTime}</td>
              <td><strong>{dollars(product.price)}/year</strong></td>
              <td><a className="button secondary" href={productUrl(product.slug)}>Details</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
