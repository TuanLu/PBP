<?php
class Magebay_Productbuilderpro_Block_Adminhtml_Additional_Product_Info extends Mage_Core_Block_Abstract
{
    protected function _toHtml()
    {
        $item = $this->getParentBlock()->getItem();
        $additionalOptions = serialize($item->getProductOptionByCode("additional_options"));
        if($additionalOptions) {
            $customizeInfo = Mage::helper("productbuilderpro")->getCustomizeInfo($additionalOptions);
            if($customizeInfo) {
                /**
                 <dt><span style="font-weight: bold"><?php echo $this->__('Customize Info') ?></span></dt>
    <dl class="item-options pdp_cart_item">
    <?php foreach ($customizeInfo['selected_layer'] as $layer) : ?>
        <dt><?php echo $this->__($layer['root_title']) ?></dt>
        <dd><?php echo $this->__($layer['title']) ?></dd>
    <?php endforeach; ?>
        <dt><?php echo $this->__("Design Preview") ?></dt>
        <dd>
            <a href="<?php echo $customizeInfo['thumbnail_image']  ?>" target="_blank">
                <img width="300px" src="<?php echo $customizeInfo['thumbnail_image'] ?>"/>
            </a>
        </dd>
    </dl>
                **/
                
                $html = "<div>";
                    $html .= '<dt><span style="font-weight: bold">' . Mage::helper("productbuilderpro")->__("Customize Info") . '</span></dt>';
                    $html .= '<dl class="item-options pdp_cart_item">';
                    foreach ($customizeInfo['selected_layer'] as $layer) {
                        $html .= '<dt>' . $layer['root_title'] . '<dt>';
                        $html .= '<dd>' . $layer['title'] . '<dd>';
                    }
                    $html .= "<dt>". Mage::helper("productbuilderpro")->__("Design Preview") ."</dt>";
                    $html .= "<dd><img src='". $customizeInfo['thumbnail_image'] ."' width='200px'/></dd>";
                    $html .= '</dl>';
                $html .= "</div>";
                return $html;
            }
        }
    }
}