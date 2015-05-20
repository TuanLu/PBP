<?php
class Magebay_Productbuilderpro_IndexController extends Mage_Core_Controller_Front_Action
{
    public function indexAction()
    {
        $this->loadLayout();
        $this->renderLayout();
    }
	public function testAction() {
		echo "Product Builder Pro";
        $productList = array(
            array(
                'name' => 'Play staytion 3',
                'options' => array(
                    array(
                        'title' => " Option 1",
                        'thumbnail' => "thumbnail1.png",
                        'main_image' => "thumbnail1.png",
                    ),
                    array(
                        'title' => " Option 1",
                        'thumbnail' => "thumbnail1.png",
                        'main_image' => "thumbnail1.png",
                    )
                )
            ),
            array(
                'name' => 'Xbox',
                'options' => array(
                    array(
                        'title' => " Xbox Option 1",
                        'thumbnail' => "thumbnail1.png",
                        'main_image' => "thumbnail1.png",
                    ),
                    array(
                        'title' => " Xbox Option 1",
                        'thumbnail' => "thumbnail1.png",
                        'main_image' => "thumbnail1.png",
                    )
                )
            )
        );
        
        Zend_Debug::dump($productList);
        echo json_encode($productList);
		
	}
    public function addProductAction() {
        echo "Add Product Page";
    }
}