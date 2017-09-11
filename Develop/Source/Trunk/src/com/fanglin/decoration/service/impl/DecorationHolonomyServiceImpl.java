package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.DecorationHolonomyService;
import com.fanglin.decoration.vo.DecorationHolonomyVO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationHolonomyService")
@Transactional(readOnly=true)
public class DecorationHolonomyServiceImpl implements DecorationHolonomyService {
	
	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao; 
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DecorationPaymentService decorationPaymentService;
	
	@Override
	public void pageDecorationHolonomy(Paging paging, List<Filter> filters, int company) {
		
		if(filters.size() == 0) return ;
		
		List<DecorationHolonomyPO> decorationHolonomyPOs = decorationHolonomyDao.pagedecorationHolonomy(paging, filters, company);
		List<DecorationHolonomyVO> decorationHolonomyVOs = new ArrayList<DecorationHolonomyVO>();
		
		for(DecorationHolonomyPO decorationHolonomyPO: decorationHolonomyPOs){
			
			DecorationHolonomyVO _decorationHolonomyVO = new DecorationHolonomyVO(new DecorationOrderVO());
			
			BeanUtil.copyProperties(decorationHolonomyPO, _decorationHolonomyVO, Arrays.asList("decorationOrder"));
			
			copyDecorationHolonomyPOToVO(decorationHolonomyPO.getDecorationOrder(), _decorationHolonomyVO.getDecorationOrder());
			
			decorationHolonomyVOs.add(_decorationHolonomyVO);
		}
		
		paging.setData(decorationHolonomyVOs);

	}

	@Override
	public DecorationHolonomyVO queryDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO) {
		
		DecorationHolonomyVO _decorationHolonomyVO = new DecorationHolonomyVO(new DecorationOrderVO());
		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(decorationHolonomyVO.getDecorationOrder().getOrderId());
		
		if(decorationHolonomyPO == null){
			return _decorationHolonomyVO;
		}
		
		BeanUtil.copyProperties(decorationHolonomyPO, _decorationHolonomyVO, Arrays.asList("decorationOrder"));
		
		copyDecorationHolonomyPOToVO(decorationHolonomyPO.getDecorationOrder(), _decorationHolonomyVO.getDecorationOrder());
		
		return _decorationHolonomyVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void makeDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO, String userId) throws FLException {
		
		String orderId = decorationHolonomyVO.getDecorationOrder().getOrderId();
		
		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(orderId);
		List<String> paymentType = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_FIRST_STR,DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR,DecorationPaymentPO.PAYMENTTYPE_SECOND_STR,DecorationPaymentPO.PAYMENTTYPE_FINAL_STR});

		if(decorationHolonomyPO != null){
			if(decorationHolonomyPO.getStatus() != DecorationHolonomyPO.STATUS_INIT_SHORT || !Float.valueOf(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT).equals(decorationHolonomyPO.getServicePaidup())){
				throw new FLException(140043,"订单半价信息不可更新");
			}
			if(paymentType.contains(decorationHolonomyPO.getDecorationOrder().getPaymentStatus())){
				throw new FLException(140043,"订单半价信息不可更新");
			}
			BeanUtil.copyProperties(decorationHolonomyVO, decorationHolonomyPO,Arrays.asList("decorationOrder","dhid"));
		}else{
			decorationHolonomyPO = new DecorationHolonomyPO(new DecorationOrderPO());
			BeanUtil.copyProperties(decorationHolonomyVO, decorationHolonomyPO,Arrays.asList("decorationOrder"));
			BeanUtil.copyProperties(decorationOrderDao.queryDecorationOrderByOrderId(decorationHolonomyVO.getDecorationOrder().getOrderId()), decorationHolonomyPO.getDecorationOrder(),Arrays.asList("customerPO","villagePO","designerPO","salesmanPO","supervisorPO","inspectionPO","versionPO","createUserPO"));
		}
		
		Float manageRate = decorationHolonomyVO.getManageRate();
		Float projectPrice = (float) Arith.div(decorationHolonomyVO.getProjectPrice(), Arith.add(1, manageRate));
		Float disprojectPrice = (float) Math.floor(Arith.mul(projectPrice,decorationHolonomyVO.getDiscount() / 10));

		Float managePrice = (float) Math.floor(Arith.mul(projectPrice, manageRate));
		Float materialPrice = (float) Math.ceil(Arith.mul(decorationHolonomyVO.getProjectPrice(), decorationHolonomyVO.getMaching()));
		Float servicePrice = (float) Math.floor(Arith.mul(materialPrice, decorationHolonomyVO.getServiceRate()));
		
		decorationHolonomyPO.setProjectPrice(disprojectPrice);
		decorationHolonomyPO.setManagePrice(managePrice);
		decorationHolonomyPO.setMaterialPrice(materialPrice);
		decorationHolonomyPO.setServicePrice(servicePrice);
		
		decorationHolonomyPO.setMaterialPaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT);
		decorationHolonomyPO.setServicePaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT);

		decorationHolonomyDao.saveOrUpdate(decorationHolonomyPO);
		
		DecorationPaymentVO decorationpaymentVO = new DecorationPaymentVO();
		
		decorationpaymentVO.setReferMoney((float) Math.floor(Arith.add(disprojectPrice, managePrice)));
		decorationpaymentVO.setOrderId(orderId);
		decorationpaymentVO.setPsId(decorationHolonomyVO.getPsId());
		
		decorationPaymentService.makeDecorationPayment(decorationpaymentVO, userId);
		
		decorationHolonomyVO.setProjectPrice(disprojectPrice);
		decorationHolonomyVO.setManagePrice(managePrice);
		decorationHolonomyVO.setMaterialPrice(materialPrice);
		decorationHolonomyVO.setServicePrice(servicePrice);

		
	}

	public void copyDecorationHolonomyPOToVO(DecorationOrderPO decorationOrderPO,DecorationOrderVO decorationOrderVO){
		
		BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
		
		if(decorationOrderVO.getOrderTotalPrice() == null){
			decorationOrderVO.setOrderTotalPrice(new Float(0));
		}
		
		VillageVO villageVO = new VillageVO();
		CityProperVO cityProperVO = new CityProperVO();
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cityProperVO, Arrays.asList("city"));	
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper","buildingNameRule"));	
		villageVO.setCityProper(cityProperVO);
		decorationOrderVO.setVillage(villageVO);
		
		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
		customerVO.setConfidentialInfo();
		decorationOrderVO.setCustomer(customerVO);
		
		UserPO designer = decorationOrderPO.getDesignerPO();
		
		decorationOrderVO.setDesigner(designer.getCurrentName());
		decorationOrderVO.setDesignerId(designer.getUserId());
		decorationOrderVO.setDesignerPhone(designer.getPhone());
		decorationOrderVO.setDesignDepartment(decorationOrderPO.getDesignerPO().getDept().getDeptName());
		
		if(decorationOrderPO.getDesignerPO().getDept().getFatherDept() != null){
			decorationOrderVO.setDesignRegion(decorationOrderPO.getDesignerPO().getDept().getFatherDept().getDeptName());
		}
		
		UserPO salesman = decorationOrderPO.getSalesmanPO();
		
		decorationOrderVO.setSalesman(salesman.getCurrentName());
		decorationOrderVO.setSalesmanId(salesman.getUserId());
		decorationOrderVO.setSalesmanPhone(salesman.getPhone());
		decorationOrderVO.setBusinessDepartment(decorationOrderPO.getSalesmanPO().getDept().getDeptName());
	}
	

}
