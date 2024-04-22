/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categ => categ.id === product.categoryId,
  ); // find by product.categoryId
  const user = usersFromServer.find(person => person.id === category.ownerId); // find by category.ownerId

  return { ...product, categoryObj: category, userObj: user };
});

const newCategory = categoriesFromServer.map(categ => ({
  ...categ,
  isInfo: false,
}));

export const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [userID, setuserID] = useState(NaN);
  const [product, setProduct] = useState(products);
  const [filterProduct, setfilterProduct] = useState(products);
  const [categoryList, setCategoryList] = useState(newCategory);
  const [inputText, setInputText] = useState('');

  function handleSortUsers(id) {
    if (inputText !== '') {
      setIsActive(true);
      setuserID(id);
      setProduct([...filterProduct].filter(el => el.userObj.id === id));
      setfilterProduct([...filterProduct].filter(el => el.userObj.id === id));
    }

    if (inputText === '') {
      setIsActive(true);
      setuserID(id);
      setfilterProduct([...products].filter(el => el.userObj.id === id));
      setProduct([...products].filter(el => el.userObj.id === id));
    }
  }

  function handleSortAllUsers() {
    setIsActive(false);
    setProduct(products);
  }

  function handleSortByCategory(id) {
    setCategoryList(
      [...categoryList].map(el =>
        el.id === id
          ? {
              ...el,
              isInfo: !el.isInfo,
            }
          : el,
      ),
    );

    // setProduct([...products].filter(el => el.name === categoryList))
  }

  function handleFilterInput(e) {
    setInputText(e);
    if (isActive) {
      setProduct(
        [...filterProduct].filter(el => el.name.toLowerCase().includes(e)),
      );
    }

    if (!isActive) {
      setProduct([...products].filter(el => el.name.toLowerCase().includes(e)));
      setfilterProduct(
        [...products].filter(el => el.name.toLowerCase().includes(e)),
      );
    }
  }

  function handleFilterInputClean() {
    setInputText('');
    setProduct(products);
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={isActive ? '' : 'is-active'}
                onClick={() => handleSortAllUsers()}
              >
                All
              </a>

              {usersFromServer.map(el => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={isActive && el.id === userID ? 'is-active' : ''}
                  onClick={() => handleSortUsers(el.id)}
                >
                  {el.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  value={inputText}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  onChange={e =>
                    handleFilterInput(e.target.value.toLowerCase())
                  }
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {inputText !== '' && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleFilterInputClean}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoryList.map(cat => (
                <a
                  data-cy="Category"
                  className={`button mr-2 my-1 ${cat.isInfo ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => handleSortByCategory(cat.id)}
                >
                  {cat.title}
                </a>
              ))}
              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {product.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {product.map(el => (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {el.id}
                    </td>
                    <td data-cy="ProductName">{el.name}</td>
                    <td data-cy="ProductCategory">{`${el.categoryObj.icon} - ${el.categoryObj.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={
                        el.userObj.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {el.userObj.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
