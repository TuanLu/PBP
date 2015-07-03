<?php
class Magebay_Productbuilderpro_Model_Observer extends Varien_Object
{
    public function catalogProductLoadAfter(Varien_Event_Observer $observer)
    {
        return;
        // set the additional options on the product
        $action = Mage::app()->getFrontController()->getAction();
        //if ($action->getFullActionName() == 'checkout_cart_add') {
        if ($action->getFullActionName() == 'productbuilderpro_main_addtocart') {
            $product = $observer->getProduct();
            // add to the additional options array
            $additionalOptions = array();
            if ($additionalOption = $product->getCustomOption('additional_options'))
            {
                $additionalOptions = (array) unserialize($additionalOption->getValue());
            }
            Zend_Debug::dump($product->getCustomOption('additional_options'));
            die;
            $additionalOptions[] = array(
                'code' => 'pdpinfo',
                'label' => '',
                'value' => '',
                'json' => $extraOption,
                'time' => microtime()
            );
            // add the additional options array with the option code additional_options
            $observer->getProduct()
                ->addCustomOption('additional_options', serialize($additionalOptions));
        }
    }
    public function salesConvertQuoteItemToOrderItem(Varien_Event_Observer $observer)
    {
        $quoteItem = $observer->getItem();
        if ($additionalOptions = $quoteItem->getOptionByCode('additional_options')) {
            $orderItem = $observer->getOrderItem();
            $options = $orderItem->getProductOptions();
            $options['additional_options'] = unserialize($additionalOptions->getValue());
            $orderItem->setProductOptions($options);
        }
    }
    public function updatePrice($observer) {
    	$event = $observer->getEvent();
    	$quote_item = $event->getQuoteItem();
		$_product = $quote_item->getProduct();
		$extraPrice = 0;
        //Check additional_options to get customized price
        $buyInfo = $quote_item->getBuyRequest();
        $optionSerialize = $_product->getCustomOption('additional_options')->getData('value');
        $optionUnSerialize = unserialize($optionSerialize);
        foreach ($optionUnSerialize as $option) {
            if(isset($option["code"]) && $option["code"] == "pbpinfo") {
                $customizeInfo = json_decode($option["json"], true);
                if(isset($customizeInfo['total_price']) && $customizeInfo['total_price']) {
                    $extraPrice = $customizeInfo['total_price'];
                }
                break;
            } 
        }
    	$quote_item->setOriginalCustomPrice($extraPrice);
    	return;
    }
}