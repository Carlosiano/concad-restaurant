import React, { useState, useEffect } from 'react'
import { db, fs } from '../libs/firebase-config'
import { FaTrash } from 'react-icons/fa';
import './Keranjang.scss'
import { Footer } from '../components'
import { DataMenu, DataMenuCategory } from '../assets/data/menu';

export default function Keranjang() {

  // isi variabel cart ketika ada pesanan di database
  useEffect(() => {
    db.collection("cart")
      .onSnapshot((querySnapshot) => {
        var p = [];
        querySnapshot.forEach((doc) => {
          p.push(doc.data());
          products.map((i) => {
            if (i.id === doc.data().id) {
              i.cart = true
            }
          })
        });
        setCart(p)
      });

  }, []);

  const [products, setProducts] = useState(DataMenu)
  const [cart, setCart] = useState([])

  // fungsi untuk menambah pesanan ke database
  function addToCart(item) {
    products.map((i) => {
      if (i.id == item.id) {
        i.cart = true
      }
    })
    db.collection('cart').doc(`${item.id}`).set(item, { merge: true })
  }

  // fungsi untuk menghapus pesanan dari database
  function removeFromCart(item) {
    products.map((i) => {
      if (i.id === item.id) {
        i.cart = false
      }
    })
    db.collection('cart').doc(`${item.id}`).delete()
  }

  // fungsi untuk menambah jumblah pesanan
  function increase(item) {
    db.collection('cart').doc(`${item.id}`).update("quantity", fs.firestore.FieldValue.increment(1))
  }

  // fungsi untuk mengurangi jumblah pesanan
  function decrease(item) {
    if (item.quantity == 1) {
      removeFromCart(item)
    }
    db.collection('cart').doc(`${item.id}`).update("quantity", fs.firestore.FieldValue.increment(-1))
  }

  // fungsi untuk menampilkan total harga pesanan
  const showTotal = () => {
    let total = 0
    cart.map((item) => {
      total += (item.harga - (item.harga * (item.diskon / 100))) * item.quantity
    })
    return total
  }

  return (
    <div>
      <div className='keranjang'>
        <section className="h-100">
          <div className="container h-100 py-5">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-10">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-normal mb-0 text-black">Shopping Cart</h3>
                </div>
                {
                  // melakukan perulangan untuk menampilkan semua list menu yang ada di keranjang
                  cart.map((menu) => (
                    <div className="card rounded-3 mb-4">
                      <div className="card-body p-4">
                        <div className="row d-flex justify-content-between align-items-center">
                          <div className="col-md-2 col-lg-2 col-xl-2">
                            <img src={`./assets/img/menu/${menu.img}`} className="img-fluid rounded-3" alt="Cotton T-shirt" />
                          </div>
                          <div className="col-md-3 col-lg-3 col-xl-3">
                            <p className="lead fw-normal mb-2">{menu.nama}</p>
                            <h5 className="mb-0">Rp.{menu.harga - (menu.harga * (menu.diskon / 100))}</h5>
                          </div>
                          <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                              <button type="button" className="btn btn-danger" onClick={() => decrease(menu)}>-</button>
                              <button type="button" className="btn btn-success" onClick={() => increase(menu)}>+</button>
                              <input id="form1" min="0" max="20" name="quantity" type="number" className="form-control form-control-sm" value={menu.quantity} />
                            </div>
                          </div>
                          <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                            <h5 className="mb-0">Rp.{(menu.harga - (menu.harga * (menu.diskon / 100))) * menu.quantity}</h5>
                          </div>
                          <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                            <a href="#" className="text-danger">
                              <FaTrash size={30} onClick={() => removeFromCart(menu)} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
                <div className="card">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <a href="https://wa.me/6281215046219?text=I%20am%20interested%20in%20your%20car%20for%20sale">
                      <button type="button" className="btn btn-danger btn-block btn-lg">Proceed to Pay</button>
                    </a>
                    <h3 className='text-success'>Rp.{showTotal()}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
