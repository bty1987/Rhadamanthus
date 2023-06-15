package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
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
	private DecorationActivityDao decorationActivityDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private ServiceRecordDao serviceRecordDao;

	@Override
	public void pageDecorationHolonomy(Paging paging, List<Filter> filters, int company) {

		if (filters.size() == 0) return;

		List<DecorationHolonomyPO> decorationHolonomyPOs = decorationHolonomyDao.pagedecorationHolonomy(paging, filters, company);
		List<DecorationHolonomyVO> decorationHolonomyVOs = new ArrayList<DecorationHolonomyVO>();

		for (DecorationHolonomyPO decorationHolonomyPO : decorationHolonomyPOs) {

			DecorationHolonomyVO decorationHolonomyVO = new DecorationHolonomyVO(new DecorationVO());

			BeanUtil.copyProperties(decorationHolonomyPO, decorationHolonomyVO, Arrays.asList("decoration"));

			decorationHolonomyVO.getDecoration().setEscorter(new UserBaseVO());
			decorationHolonomyVO.getDecoration().setQuoter(new UserBaseVO());

			decorationHolonomyPO.getDecoration().ptvcascade(decorationHolonomyVO.getDecoration());

			decorationHolonomyVOs.add(decorationHolonomyVO);
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

		if (decorationActivityDao.countDecorationActivity(orderId, null) == 0) {
			throw new FLException(140033, "订单活动信息不存在");
		}

		if (decorationActivityDao.countDecorationActivity(orderId, DecorationActivityPO.STATUS_INIT_INT) > 0) {
			throw new FLException(140060, "活动未锁定");
		}

		// 获取装修单对应的半价信息
		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(orderId);

		int serviceRate = decorationHolonomyVO.getServiceRate() != null ? decorationHolonomyVO.getServiceRate() : 100;

		if (decorationHolonomyPO != null) {

			if (decorationHolonomyPO.getStatus() != DecorationHolonomyPO.STATUS_INIT_SHORT || !Long.valueOf(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_INT).equals(decorationHolonomyPO.getServicePaidup())) {
				throw new FLException(140043, "订单半价/满减信息不可更新");
			}

			BeanUtil.copyProperties(decorationHolonomyVO, decorationHolonomyPO, Arrays.asList("decoration", "dhid"));
		} else {
			decorationHolonomyPO = new DecorationHolonomyPO(decorationPO);
			BeanUtil.copyProperties(decorationHolonomyVO, decorationHolonomyPO, Arrays.asList("decoration"));
		}

		Long projectPrice = Arith.add(Arith.add(quotationPO.getDisPrice(), quotationPO.getUndisPrice()), quotationPO.getTrafficPrice());

		Long remainder = projectPrice % decorationHolonomyVO.getDiscountBase();

		// 折后工程额 :工程总额
		Long disprojectPrice = Arith.mul(Arith.div(Arith.add(Arith.div(Arith.mul(Arith.sub(projectPrice, remainder), decorationHolonomyVO.getDiscount()), 10000), remainder), 1000000), 1000000);

		// 管理费
		Long managePrice = decorationHolonomyVO.getManageDiscount() == 1 ? Arith.mul(quotationPO.getManagePrice(), Arith.div(decorationHolonomyVO.getDiscount(), 10000)) : quotationPO.getManagePrice();

		// 工程基础额 与报价额相同
		Long projectBase = Arith.add(projectPrice, Arith.add(quotationPO.getManagePrice(), quotationPO.getTaxPrice()));

		// 主材总额 = 工程总额 * 主材配比
		Long materialPrice = Arith.mul(Arith.div(Arith.mul(projectBase, decorationHolonomyVO.getMaching()), 1000000), 1000000);

		// 服务费 = 服务费 * 服务费比例
		Long servicePrice = Arith.mul(Arith.div(Arith.mul(materialPrice, serviceRate), 1000000), 1000000);

		decorationHolonomyPO.setProjectPrice(disprojectPrice);
		decorationHolonomyPO.setManagePrice(managePrice);
		decorationHolonomyPO.setOriginMaterialPrice(materialPrice);
		decorationHolonomyPO.setMaterialPrice(materialPrice);
		decorationHolonomyPO.setServicePrice(servicePrice);
		decorationHolonomyPO.setServiceRate(serviceRate);
		decorationHolonomyPO.setProjectBase(projectBase);

		decorationHolonomyPO.setMaterialPaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_INT);
		decorationHolonomyPO.setServicePaidup(DecorationHolonomyPO.MONEY_SERVICEPAIDUP_INT);

		decorationHolonomyDao.saveOrUpdate(decorationHolonomyPO);

		// 传给款项
		// 生成装修款信息 , 通过款项比例对应的比例项信息生成装修款信息
		decorationPaymentService.makeDecorationPayment(decorationPO, quotationPO.getTotalPrice(), quotationPO.getCostPrice(), decorationHolonomyVO.getPsId(), userId);

		decorationHolonomyVO.setProjectPrice(disprojectPrice);
		decorationHolonomyVO.setManagePrice(managePrice);
		decorationHolonomyVO.setMaterialPrice(materialPrice);
		decorationHolonomyVO.setServicePrice(servicePrice);
		decorationHolonomyVO.setProjectBase(projectBase);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO, String userId) throws FLException {

		String orderId = decorationHolonomyVO.getDecoration().getOrderId();
		long materialPrice = decorationHolonomyVO.getMaterialPrice();

		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(decorationHolonomyVO.getDecoration().getOrderId());

		if (decorationHolonomyPO == null) {
			throw new FLException(140042, "半价/满减信息不存在");
		}

		decorationHolonomyPO.setMaterialPrice(decorationHolonomyVO.getMaterialPrice());

		decorationHolonomyDao.update(decorationHolonomyPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("更新满减信息,装修单:%s,主材配额:%.3f", orderId, Arith.div(materialPrice, 1000.0))));
	}

}
