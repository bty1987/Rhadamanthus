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
import com.fanglin.decoration.dao.DecorationInclusiveDao;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationInclusivePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationInclusiveService;
import com.fanglin.decoration.vo.DecorationInclusiveVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationInclusiveService")
@Transactional(readOnly = true)
public class DecorationInclusiveServiceImpl implements DecorationInclusiveService {

	@Autowired
	private DecorationInclusiveDao decorationInclusiveDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationPaymentService decorationPaymentService;

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Autowired
	private ExtensionDao extensionDao;

	@Override
	public void pageDecorationInclusive(Paging paging, List<Filter> filters, int company) {

		if (filters.size() == 0)
			return;

		List<DecorationInclusivePO> decorationInclusivePOs = decorationInclusiveDao.pageDecorationInclusive(paging, filters, company);
		List<DecorationInclusiveVO> decorationInclusiveVOs = new ArrayList<DecorationInclusiveVO>();

		for (DecorationInclusivePO decorationInclusivePO : decorationInclusivePOs) {

			DecorationInclusiveVO decorationInclusiveVO = new DecorationInclusiveVO(new DecorationVO());

			BeanUtil.copyPropertie(decorationInclusivePO, decorationInclusiveVO, Arrays.asList("decoration"));

			decorationInclusiveVO.getDecoration().setEscorter(new UserBaseVO());
			decorationInclusiveVO.getDecoration().setQuoter(new UserBaseVO());

			decorationInclusivePO.getDecoration().ptvcascade(decorationInclusiveVO.getDecoration());

			decorationInclusiveVOs.add(decorationInclusiveVO);
		}

		paging.setData(decorationInclusiveVOs);
	}

	@Override
	public DecorationInclusiveVO queryDecorationInclusive(DecorationInclusiveVO decorationInclusiveVO) {

		DecorationInclusiveVO _decorationInclusiveVO = new DecorationInclusiveVO(new DecorationVO());
		DecorationInclusivePO decorationInclusivePO = decorationInclusiveDao.queryDecorationInclusiveByOrderId(decorationInclusiveVO.getDecoration().getOrderId());

		if (decorationInclusivePO == null)
			return null;

		BeanUtil.copyPropertie(decorationInclusivePO, _decorationInclusiveVO, Arrays.asList("decoration"));

		decorationInclusiveVO.getDecoration().setEscorter(new UserBaseVO());
		decorationInclusiveVO.getDecoration().setQuoter(new UserBaseVO());

		decorationInclusivePO.getDecoration().ptvcascade(decorationInclusiveVO.getDecoration());

		return _decorationInclusiveVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void makeDecorationInclusive(DecorationInclusiveVO decorationInclusiveVO, String userId) throws FLException {

		String orderId = decorationInclusiveVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationPO.getType() == DecorationPO.TYPE_INCLUSIVE_INT) {
			decorationPO.setSaleScale(DecorationPO.TYPE_INIT_SALESCALE_INT);
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

		long undisPrice = 0;
		long disPrice = 0;
		long total = 0;

		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(orderId);

		for (ExtensionPO extensionPO : extensionPOs) {

			undisPrice = Arith.add(undisPrice, Arith.mul(extensionPO.getUndisPrice(), extensionPO.getType() == ExtensionPO.TYPE_ADD_INT ? 1000 : -1000));
			disPrice = Arith.add(disPrice, Arith.mul(extensionPO.getDisPrice(), extensionPO.getType() == ExtensionPO.TYPE_ADD_INT ? 1000 : -1000));

			extensionPO.setStatus(ExtensionPO.STATUS_LOCK_INT);

			extensionDao.update(extensionPO);
		}

		total = Arith.add(Arith.add(quotationPO.getTotalPrice(), undisPrice), Arith.div(Arith.mul(disPrice, quotationPO.getDiscount()), 10000));

		DecorationInclusivePO decorationInclusivePO = decorationInclusiveDao.queryDecorationInclusiveByOrderId(orderId);

		if (decorationInclusivePO == null) {
			decorationInclusivePO = new DecorationInclusivePO(decorationPO);
		}

		BeanUtil.copyPropertie(decorationInclusiveVO, decorationInclusivePO, Arrays.asList("decoration"));

		decorationInclusivePO.setProjectPrice(total);
		decorationInclusivePO.setCdiff(DecorationInclusivePO.MONEY_ZERO_LONG);
		decorationInclusivePO.setMdiff(DecorationInclusivePO.MONEY_ZERO_LONG);
		decorationInclusivePO.setMaterialPaidup(DecorationInclusivePO.MONEY_ZERO_LONG);
		decorationInclusivePO.setManagePrice(quotationPO.getManagePrice());
		decorationInclusivePO.setManageRate(quotationPO.getManageRate());

		decorationInclusiveDao.saveOrUpdate(decorationInclusivePO);

		decorationPaymentService.makeDecorationPayment(decorationPO, total, quotationPO.getCostPrice(), decorationInclusiveVO.getPsId(), userId);

		BeanUtil.copyPropertie(decorationInclusivePO, decorationInclusiveVO, Arrays.asList("decoration"));

	}
}
