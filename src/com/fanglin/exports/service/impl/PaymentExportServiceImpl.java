/**
 * @File Name		: PaymentExportServiceImpl.java
 * @Package   	: com.fanglin.exports.service.impl
 * @Version		: 1.0
 * @Date			: 2017-8-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.exports.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.VillagePO;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.exports.service.PaymentExportService;
import com.fanglin.exports.vo.DecorationPaymentExportVO;
import com.fanglin.exports.vo.MaterialPaymentExportVO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("paymentExportService")
@Transactional(readOnly=true)
public class PaymentExportServiceImpl implements PaymentExportService {
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private MaterialPaymentDao materialPaymentDao;

	@Override
	public List<DecorationPaymentExportVO> queryDecorationPaymentExport(List<Filter> filters) {
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPayment(filters);
		List<DecorationPaymentExportVO> decorationPaymentExportVOs = new ArrayList<DecorationPaymentExportVO>();
		
		DecorationPaymentExportVO decorationPaymentExportVO;
		
		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			
			decorationPaymentExportVO = new DecorationPaymentExportVO();
			
			decorationPaymentExportVO.setPaymentType(decorationPaymentPO.getPaymentType());
			decorationPaymentExportVO.setReferMoney(decorationPaymentPO.getRealMoney());
			
			DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
			
			if(decorationReceiptPO != null){
				
				decorationPaymentExportVO.setCollectTime(decorationReceiptPO.getCollectTime());
				decorationPaymentExportVO.setCoupon(decorationReceiptPO.getCoupon());
				decorationPaymentExportVO.setCouponInfo(decorationReceiptPO.getCouponInfo());
			}
			
			DecorationPO decorationPO = decorationPaymentPO.getDecoration();
			VillagePO villagePO = decorationPO.getHouse().getVillage();
			UserPO designer = decorationPO.getDesigner();
			
			decorationPaymentExportVO.setDesigner(designer.getUserName());
			decorationPaymentExportVO.setDesignerDepartment(designer.getDept().getDeptName());
			decorationPaymentExportVO.setOrderId(decorationPO.getOrderId());
			decorationPaymentExportVO.setVillage(villagePO.getName());
			decorationPaymentExportVO.setHouseNumber(decorationPO.getHouse().getHouseNumber());
			
			decorationPaymentExportVOs.add(decorationPaymentExportVO);
		}
		
		return decorationPaymentExportVOs;
	}

	@Override
	public List<MaterialPaymentExportVO> queryMaterialPaymentExport(List<Filter> filters) {
		
		Map<Integer, String> types = new HashMap<Integer, String>();
		types.put(2, MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_STR);
		types.put(3, MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_STR);
		types.put(4, MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_STR);
		types.put(5, MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_STR);
		types.put(6, MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_STR);
		types.put(7, MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_STR);
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPayment(filters);
		List<MaterialPaymentExportVO> materialPaymentExportVOs = new ArrayList<MaterialPaymentExportVO>();
		
		MaterialPO materialPO;
		MaterialPaymentExportVO materialPaymentExportVO;
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			
			materialPaymentExportVO = new MaterialPaymentExportVO();
			
			BeanUtil.copyProperties(materialPaymentPO, materialPaymentExportVO);

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentExportVO);
			}
			
			materialPO = materialPaymentPO.getMaterial();
			
			if(materialPO != null){
				BeanUtil.copyProperties(materialPO, materialPaymentExportVO);
				
				materialPaymentExportVO.setMsoCoupon(materialPO.getCoupon());
				materialPaymentExportVO.setMsoCouponInfo(materialPO.getCouponInfo());
			}
			
			materialPaymentExportVO.setPaymentTypeName(types.get(materialPaymentPO.getPaymentType()));
			
			materialPaymentExportVOs.add(materialPaymentExportVO);
		}
		
		return materialPaymentExportVOs;
	}

}
