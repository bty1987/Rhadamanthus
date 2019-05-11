package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationHolonomyService;
import com.fanglin.decoration.vo.DecorationHolonomyVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationHolonomyService")
@Transactional(readOnly = true)
public class DecorationHolonomyServiceImpl implements DecorationHolonomyService {

	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationPaymentService decorationPaymentService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Autowired
	private QuotationDao quotationDao;

	@Override
	public void pageDecorationHolonomy(Paging paging, List<Filter> filters, int company) {

		if (filters.size() == 0)
			return;

		List<DecorationHolonomyPO> decorationHolonomyPOs = decorationHolonomyDao.pagedecorationHolonomy(paging, filters, company);
		List<DecorationHolonomyVO> decorationHolonomyVOs = new ArrayList<DecorationHolonomyVO>();

		for (DecorationHolonomyPO decorationHolonomyPO : decorationHolonomyPOs) {

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

		if (decorationHolonomyPO == null) {
			return _decorationHolonomyVO;
		}

		BeanUtil.copyProperties(decorationHolonomyPO, _decorationHolonomyVO, Arrays.asList("decoration"));

		_decorationHolonomyVO.getDecoration().setEscorter(new UserBaseVO());
		_decorationHolonomyVO.getDecoration().setQuoter(new UserBaseVO());

		decorationHolonomyPO.getDecoration().ptvcascade(_decorationHolonomyVO.getDecoration());

		return _decorationHolonomyVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void makeDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO, String userId) throws FLException {

		String orderId = decorationHolonomyVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(150002, "合同已签订不可修改");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() != QuotationPO.STATUS_LOCK_INT) {
			throw new FLException(200031, "报价未锁定");
		}
		
		if (decorationActivityDao.countDecorationActivity(orderId, null) == 0){
			throw new FLException(140033, "订单活动信息不存在");
		}

		if (decorationActivityDao.countDecorationActivity(orderId, DecorationActivityPO.STATUS_INIT_INT) > 0) {
			throw new FLException(140060, "活动未锁定");
		}

		// 获取装修单对应的半价信息
		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(orderId);
		
		// 服务款比例
		SystemConfigPO servicePaymentRatio = systemConfigDao.querySystemConfig(String.format("servicePaymentRatio%d", decorationPO.getType()), decorationPO.getCompany());

		float ratio = Arith.sub(servicePaymentRatio != null ? Float.parseFloat(servicePaymentRatio.getValue()) : 1.1f, 1f);

		if (decorationHolonomyPO != null) {

			if (decorationHolonomyPO.getStatus() != DecorationHolonomyPO.STATUS_INIT_SHORT || !Float.valueOf(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT).equals(decorationHolonomyPO.getServicePaidup())) {
				throw new FLException(140043, "订单半价/满减信息不可更新");
			}

			BeanUtil.copyProperties(decorationHolonomyVO, decorationHolonomyPO, Arrays.asList("decoration", "dhid"));
		} else {
			decorationHolonomyPO = new DecorationHolonomyPO(decorationPO);
			BeanUtil.copyProperties(decorationHolonomyVO, decorationHolonomyPO, Arrays.asList("decoration"));
		}

		// 管理费比例
		Float manageRate = Arith.add(quotationPO.getManageRate(), decorationPO.getNotSalesmanRate());

		// 折前工程总额 = 选择报价总金额(工程总额)/(1+管理费比例)
		//Float projectPrice = (float) Arith.div(decorationHolonomyVO.getProjectBase(), Arith.add(1, manageRate));
		
		float projectPrice = Arith.add(Arith.add(quotationPO.getDisPrice(), quotationPO.getUndisPrice()), quotationPO.getTrafficPrice());
		
		Float remainder = projectPrice % decorationHolonomyVO.getDiscountBase();
		
		//折后工程额 :工程总额
		Float disprojectPrice = (float) Math.floor(Arith.add(Arith.mul(Arith.sub(projectPrice, remainder), (decorationHolonomyVO.getDiscount() / 10)), remainder));

		// 管理费= 工程总额1 * 管理费比例
		Float managePrice = (float) Math.floor(Arith.mul(projectPrice, manageRate));
		
		//工程基础额 与报价额相同
		float projectBase = Arith.add(projectPrice, managePrice);

		// 主材总额 = 工程总额 * 主材配比
		Float materialPrice = (float) Math.ceil(Arith.mul(projectBase, decorationHolonomyVO.getMaching()));

		// 服务费 = 服务费 * 服务费比例
		Float servicePrice = (float) Math.floor(Arith.mul(materialPrice, ratio));
		
		decorationHolonomyPO.setProjectPrice(disprojectPrice);
		decorationHolonomyPO.setManagePrice(managePrice);
		decorationHolonomyPO.setMaterialPrice(materialPrice);
		decorationHolonomyPO.setServicePrice(servicePrice);
		decorationHolonomyPO.setServiceRate(ratio);
		decorationHolonomyPO.setName(decorationHolonomyVO.getName());
		decorationHolonomyPO.setDiscountBase(decorationHolonomyVO.getDiscountBase());
		decorationHolonomyPO.setProjectBase(projectBase);

		decorationHolonomyPO.setMaterialPaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT);
		decorationHolonomyPO.setServicePaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_FLOAT);

		decorationHolonomyDao.saveOrUpdate(decorationHolonomyPO);

		// 传给款项
		// 生成装修款信息 , 通过款项比例对应的比例项信息生成装修款信息
		decorationPaymentService.makeDecorationPayment(decorationPO, (float) Math.floor(Arith.add(disprojectPrice, managePrice)), decorationHolonomyVO.getPsId(), userId);

		decorationHolonomyVO.setProjectPrice(disprojectPrice);
		decorationHolonomyVO.setManagePrice(managePrice);
		decorationHolonomyVO.setMaterialPrice(materialPrice);
		decorationHolonomyVO.setServicePrice(servicePrice);
		decorationHolonomyVO.setProjectBase(decorationHolonomyVO.getProjectBase());
		decorationHolonomyVO.setProjectBase(projectBase);
		
	}

}
