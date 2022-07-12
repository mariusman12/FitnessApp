import axios from 'axios'
import { React, useEffect } from 'react'
import { connect } from 'react-redux'
import EditForm from './EditForm'
import {
  handleProductEditing,
  handleEditingWindow,
  handleSelected,
  handleAddButtonDisabling,
  loadPredefined,
} from '../../actions/addActions'

function AddingList(props) {
  let state = props.addList
  const {
    handleProductEditing,
    handleEditingWindow,
    handleSelected,
    handleAddButtonDisabling,
    loadPredefined,
  } = props

  useEffect(async () => {
    let predefinedProductsList = []
    const response = await axios.get('/api/predefined')

    predefinedProductsList = JSON.parse(response.data.predefined)
    loadPredefined(predefinedProductsList)
  }, [])

  useEffect(() => {
    handleAddButtonDisabling()
  }, [])

  const handleProductsAdding = () => {
    const selectedProducts = []
    const products = document.querySelectorAll(
      '.window__main__section__large-list__item'
    )

    products.forEach((product, index) => {
      const name = product.querySelector(
        '.window__main__section__large-list__item__name'
      )

      if (name.style.fontWeight === 'bold')
        selectedProducts.push({
          name: state.savedProductList[index - 1].name,
          weight: state.savedProductList[index - 1].weight,
          proteins: state.savedProductList[index - 1].proteins,
          fats: state.savedProductList[index - 1].fats,
          carbs: state.savedProductList[index - 1].carbs,
          kcal: state.savedProductList[index - 1].kcal,
        })
    })

    if (selectedProducts.length !== 0)
      props.handlePredefinedProductsAdding(selectedProducts)
  }

  return (
    <>
      {state.isEditWindowOpened ? (
        <EditForm
          data={{
            id: state.productSendForEdit.id,
            name: state.productSendForEdit.name,
            weight: state.productSendForEdit.weight,
            proteins: state.productSendForEdit.proteins,
            fats: state.productSendForEdit.fats,
            carbs: state.productSendForEdit.carbs,
            kcal: state.productSendForEdit.kcal,
          }}
          warning={props.warning}
          handleProductEditing={handleProductEditing}
          handleEditingWindow={handleEditingWindow}
        />
      ) : null}

      <ul className='window__main__section__large-list window__main__section__large-list--heading'>
        <li className='window__main__section__large-list__item window__main__section__large-list__item--heading'>
          <div className='window__main__section__large-list__wrapper'>
            <span
              className='window__main__section__large-list__item__name'
              style={{ color: 'white' }}
            >
              Aliment name
            </span>
            <span className='window__main__section__large-list__item__nutrition-facts'>
              <p
                className='window__main__section__large-list__item__nutrition-facts__proteins'
                title='Proteins'
              >
                Protein
              </p>
              <p
                className='window__main__section__large-list__item__nutrition-facts__fats'
                title='Fats'
              >
                Fats
              </p>
              <p
                className='window__main__section__large-list__item__nutrition-facts__carbs'
                title='Carbohydrates'
              >
                Carbs
              </p>
            </span>
            <span className='window__main__section__large-list__item__calories'>
              Calories
            </span>
          </div>
        </li>
      </ul>

      <ul className='window__main__section__large-list'>
        {state.savedProductList.map((product) => {
          return (
            <li
              id={product.id}
              key={product.id}
              className='window__main__section__large-list__item'
              onClick={(e) => {
                handleSelected(e, state)
              }}
            >
              <div className='window__main__section__large-list__wrapper'>
                <span
                  id={product.id}
                  className='window__main__section__large-list__item__name'
                >
                  {product.name}
                </span>
                <span
                  id={product.id}
                  className='window__main__section__large-list__item__nutrition-facts'
                >
                  <p
                    id={product.id}
                    className='window__main__section__large-list__item__nutrition-facts__proteins'
                    title='Proteins'
                  >
                    {product.proteins} g
                  </p>
                  <p
                    id={product.id}
                    className='window__main__section__large-list__item__nutrition-facts__fats'
                    title='Fats'
                  >
                    {product.fats} g
                  </p>
                  <p
                    id={product.id}
                    className='window__main__section__large-list__item__nutrition-facts__carbs'
                    title='Carbohydrates'
                  >
                    {product.carbs} g
                  </p>
                </span>
                <span
                  id={product.id}
                  className='window__main__section__large-list__item__calories'
                >
                  {product.kcal} kcal
                </span>
              </div>
              <span
                id={product.id}
                className='window__main__section__large-list__item__weight'
              >
                {product.weight} g
              </span>
            </li>
          )
        })}
      </ul>

      <section className='window__bottom'>
        <div></div>
        <div>
          <button
            className='window__bottom__secondary-button'
            onClick={props.handleAddWindow}
          >
            Cancel
          </button>

          <button
            className={
              state.isAddButtonDisabled
                ? 'window__bottom__primary-button window__bottom__primary-button--disabled'
                : 'window__bottom__primary-button'
            }
            onClick={handleProductsAdding}
          >
            Add
          </button>
        </div>
      </section>
    </>
  )
}

const mapStateToProps = (state) => ({
  addList: state.addList,
})

export default connect(mapStateToProps, {
  handleProductEditing,
  handleEditingWindow,
  handleSelected,
  handleAddButtonDisabling,
  loadPredefined,
})(AddingList)
