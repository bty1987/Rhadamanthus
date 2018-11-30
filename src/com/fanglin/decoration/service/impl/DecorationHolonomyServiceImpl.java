package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationHolonomyService;
import com.fanglin.decoration.vo.DecorationHolonomyVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationHolonomyService")
@Transactional(readOnly=true)
public class DecorationHolonomyServiceImpl implements DecorationHolonomyService {
	
	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private DecorationPaymentService decorationPaymentService;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Override
	public void pageDecorationHolonomy(Paging paging, List<Filter> filters, int company) {
		
		if(filters.size() == 0) return ;
		
		List<DecorationHolonomyPO> decorationHolonomyPOs = decorationHolonomyDao.pagedecorationHolonomy(paging, filters, company);
		List<DecorationHolonomyVO> decorationHolonomyVOs = new ArrayList<DecorationHolonomyVO>();
		
		for(DecorationHolonomyPO decorationHolonomyPO: decorationHolonomyPOs){
			
			DecorationHolonomyVO _decorationHolonomyVO = new DecorationHolonomyVO(new DecorationVO());
			
			BeanUtil.copyProperties(decorationHolonomyPO, _decorationHolonomyVO, Arrays.asList("decoration"));
			
			_decorationHolonomyVO.getDecoration().setEscorter(new UserBaseVO());
			_decorationHolonomyVO.getDecoration().setQuoter(new UserBaseVO());
			
			decorationHolonomyPO.getDecoration().ptvcascade(_decorationHolonomyVO.getDecoration());
			
			
			decorationHolonomyVOs.add(_decorationHolonomyVO);
		}
		
		paging.setData(decorationHolonomyVOs);

	}

	@Override
	public DecorationHolonomyVO queryDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO) {
		
		DecorationHolonomyVO _decorationHolonomyVO = new DecorationHolonomyVO(new DecorationVO());
		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(decorationHolonomyVO.getDecoration().getOrderId());
		
		if(decorationHolonomyPO == null){
			return _decorationHolonomyVO;
		}
		
		BeanUtil.copyProperties(decorationHolonomyPO, _decorationHolonomyVO, Arrays.asList("decoration"));
		
		_decorationHolonomyVO.getDecoration().setEscorter(new UserBaseVO());
		_decorationHolonomyVO.getDecoration().setQuoter(new UserBaseVO());
		
		decorationHolonomyPO.getDecoration().ptvcascade(_decorationHolonomyVO.getDecoration());
		
		return _decorationHolonomyVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void makeDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO, String userId) throws FLException {
		
		String orderId = decorationHolonomyVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		//获取装修单对应的半价信息
		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(orderId);
		//已付款   已确认
		String[] paymentStatus = new String[]{DecorationPaymentPO.PAYMENTSTATUS_PAY_STR,DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR};
		//服务款比例
		SystemConfigPO servicePaymentRatio = systemConfigDao.querySystemConfig("servicePaymentRatio", decorationPO.getCompany());
		
		float ratio = Arith.sub(servicePaymentRatio != null ? Float.parseFloat(servicePaymentRatio.getValue()) : 1.1f,     1f);
		
		if(decorationHolonomyPO != null){
			if(decorationHolonomyPO.getStatus() != DecorationHolonomyPO.STATUS_INIT_SHORT || !Float.valueOf(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT).equals(decorationHolonomyPO.getServicePaidup())){
				throw new FLException(140043,"订单半价信息不可更新");
			}
			
			List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationHolonomyVO.getDecoration().getOrderId(),paymentStatus,DecorationPaymentPO.ONETYPE_ADD_INT,DecorationPaymentPO.TWOTYPE_DEAL_INT);
			
			if(decorationPayments != null && decorationPayments.size() > 0){
				throw new FLException(140043,"订单半价信息不可更新");
			}
			BeanUtil.copyProperties(decorationHolonomyVO, decorationHolonomyPO,Arrays.asList("decoration","dhid"));
		}else{
			decorationHolonomyPO = new DecorationHolonomyPO(decorationPO);
			BeanUtil.copyProperties(decorationHolonomyVO, decorationHolonomyPO,Arrays.asList("decoration"));
		}
		
		// 管理费比例
		Float manageRate = decorationHolonomyVO.getManageRate();
		
		// 折前工程总额 = 选择报价总金额(工程总额)/(1+管理费比例)
		Float projectPrice = (float) Arith.div(decorationHolonomyVO.getProjectBase(), Arith.add(1, manageRate));
		
		Float remainder= projectPrice % decorationHolonomyVO.getDiscountBase();
		Float disprojectPrice = (float) Math.floor(Arith.add(Arith.mul(Arith.sub(projectPrice, remainder), (decorationHolonomyVO.getDiscount()/10)),remainder));
		
		// 管理费= 工程总额1 * 管理费比例
		Float managePrice = (float) Math.floor(Arith.mul(projectPrice, manageRate));
		
		//主材总额 = 	工程总额 * 主材配比			
		Float materialPrice = (float) Math.ceil(Arith.mul(decorationHolonomyVO.getProjectBase(), decorationHolonomyVO.getMaching()));
		
		// 服务费 = 服务费 * 服务费比例
		Float servicePrice = (float) Math.floor(Arith.mul(materialPrice, ratio));
		
		decorationHolonomyPO.setProjectPrice(disprojectPrice);
		decorationHolonomyPO.setManagePrice(managePrice);
		decorationHolonomyPO.setMaterialPrice(materialPrice);
		decorationHolonomyPO.setServicePrice(servicePrice);
		decorationHolonomyPO.setServiceRate(ratio);
		decorationHolonomyPO.setName(decorationHolonomyVO.getName());
		decorationHolonomyPO.setDiscountBase(decorationHolonomyVO.getDiscountBase());
		decorationHolonomyPO.setProjectBase(decorationHolonomyVO.getProjectBase());
		
		decorationHolonomyPO.setMaterialPaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT);
		decorationHolonomyPO.setServicePaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT);
		
		decorationHolonomyDao.saveOrUpdate(decorationHolonomyPO);
		
		DecorationPaymentVO decorationpaymentVO = new DecorationPaymentVO();
		
		decorationpaymentVO.setReferMoney((float) Math.floor(Arith.add(disprojectPrice, managePrice)));
		decorationpaymentVO.setDecoration(decorationHolonomyVO.getDecoration());
		decorationpaymentVO.setPsId(decorationHolonomyVO.getPsId());
		
		//传给款项
		//生成装修款信息 , 通过款项比例对应的比例项信息生成装修款信息
		decorationPaymentService.makeDecorationPayment(decorationpaymentVO, userId);
		
		decorationHolonomyVO.setProjectPrice(disprojectPrice);
		decorationHolonomyVO.setManagePrice(managePrice);
		decorationHolonomyVO.setMaterialPrice(materialPrice);
		decorationHolonomyVO.setServicePrice(servicePrice);
		decorationHolonomyVO.setProjectBase(decorationHolonomyVO.getProjectBase());
		
	}
	
}
