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
import com.fanglin.decoration.dao.DecorationInclusiveDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationInclusivePO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.DecorationInclusiveService;
import com.fanglin.decoration.vo.DecorationInclusiveVO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationInclusiveService")
@Transactional(readOnly=true)
public class DecorationInclusiveServiceImpl implements DecorationInclusiveService {
	
	@Autowired
	private DecorationInclusiveDao decorationInclusiveDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private ExtensionDao extensionDao ;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private DecorationPaymentService decorationPaymentService;

	@Override
	public void pageDecorationInclusive(Paging paging, List<Filter> filters,int company) {
		
		if(filters.size() == 0) return ;
		
		List<DecorationInclusivePO> decorationInclusivePOs = decorationInclusiveDao.pageDecorationInclusive(paging, filters, company);
		List<DecorationInclusiveVO> decorationInclusiveVOs = new ArrayList<DecorationInclusiveVO>();
		
		for(DecorationInclusivePO decorationInclusivePO:decorationInclusivePOs){
			
			DecorationInclusiveVO decorationInclusiveVO = new DecorationInclusiveVO(new DecorationOrderVO());
			
			BeanUtil.copyPropertie(decorationInclusivePO, decorationInclusiveVO,Arrays.asList("decorationOrder"));
			
			copyDecorationPOToVO(decorationInclusivePO.getDecorationOrder(), decorationInclusiveVO.getDecorationOrder());
			
			decorationInclusiveVOs.add(decorationInclusiveVO);
		}
		
		paging.setData(decorationInclusiveVOs);
	}

	@Override
	public DecorationInclusiveVO queryDecorationInclusive(DecorationInclusiveVO decorationInclusiveVO) {
		
		DecorationInclusiveVO _decorationInclusiveVO = new DecorationInclusiveVO(new DecorationOrderVO());
		DecorationInclusivePO decorationInclusivePO = decorationInclusiveDao.queryDecorationInclusiveByOrderId(decorationInclusiveVO.getDecorationOrder().getOrderId());
		
		if(decorationInclusivePO == null) return null;
		
		BeanUtil.copyPropertie(decorationInclusivePO, _decorationInclusiveVO,Arrays.asList("decorationOrder"));
		
		copyDecorationPOToVO(decorationInclusivePO.getDecorationOrder(), _decorationInclusiveVO.getDecorationOrder());
		
		return _decorationInclusiveVO;
	}


	@Override
	@Transactional(rollbackFor=Exception.class)
	public void makeDecorationInclusive(DecorationInclusiveVO decorationInclusiveVO, String userId)throws FLException {
		
		String orderId = decorationInclusiveVO.getDecorationOrder().getOrderId();
		
		DecorationInclusivePO decorationInclusivePO = decorationInclusiveDao.queryDecorationInclusiveByOrderId(orderId);
		String[] paymentStatus = new String[]{DecorationPaymentPO.PAYMENTSTATUS_PAY_STR,DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR};
			
		if(decorationInclusivePO != null){
			
			List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationInclusiveVO.getDecorationOrder().getOrderId(),paymentStatus,DecorationPaymentPO.ONETYPE_ADD_INT,DecorationPaymentPO.TWOTYPE_DEAL_INT);
			
			if(decorationPayments != null && decorationPayments.size() > 0){
				throw new FLException(140043,"订单整装信息不可更新");
			}
			
		}else{
			decorationInclusivePO = new DecorationInclusivePO(new DecorationOrderPO());
		}
		
		QuotationPO quotation = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		
		if(quotation == null){
			throw new FLException(200003,"报价不存在");
		}
		
		BeanUtil.copyPropertie(decorationInclusiveVO, decorationInclusivePO,Arrays.asList("decorationOrder"));
		decorationInclusivePO.setDecorationOrder(decorationOrderDao.queryDecorationOrderByOrderId(orderId));

		decorationInclusivePO.setProjectPrice(quotation.getTotalPrice());
		decorationInclusivePO.setCdiff(extensionDao.sumExtensionByOrderId(orderId,(short)0));
		decorationInclusivePO.setMdiff(extensionDao.sumExtensionByOrderId(orderId,(short)1));
		decorationInclusivePO.setMaterialPaidup(DecorationInclusivePO.MONEY_ZERO_FLOAT);
		decorationInclusivePO.setManagePrice(quotation.getManagePrice());
		decorationInclusivePO.setManageRate(quotation.getManageRate());
		
		decorationInclusiveDao.saveOrUpdate(decorationInclusivePO);
		
		DecorationPaymentVO decorationpaymentVO = new DecorationPaymentVO();
		
		decorationpaymentVO.setReferMoney(decorationInclusiveVO.getContractPrice());
		decorationpaymentVO.setOrderId(orderId);
		decorationpaymentVO.setPsId(decorationInclusiveVO.getPsId());
		
		decorationPaymentService.makeDecorationPayment(decorationpaymentVO, userId);
		
		BeanUtil.copyPropertie(decorationInclusivePO, decorationInclusiveVO,Arrays.asList("decorationOrder"));
		
	}
	
	public void copyDecorationPOToVO(DecorationOrderPO decorationOrderPO,DecorationOrderVO decorationOrderVO){
		
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
		
		UserPO quoter = decorationOrderPO.getQuoterPO();
		
		if(quoter != null){
			decorationOrderVO.setQuoterId(quoter.getUserId());
			decorationOrderVO.setQuoter(quoter.getUserName());
		}
		
		UserPO escorter = decorationOrderPO.getEscorterPO();
		
		if(escorter != null){
			decorationOrderVO.setEscorterId(escorter.getUserId());
			decorationOrderVO.setEscorter(escorter.getUserName());
		}
	}


}
