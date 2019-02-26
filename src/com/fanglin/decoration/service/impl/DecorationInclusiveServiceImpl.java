package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationInclusiveDao;
import com.fanglin.decoration.po.DecorationInclusivePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationInclusiveService;
import com.fanglin.decoration.vo.DecorationInclusiveVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationInclusiveService")
@Transactional(readOnly = true)
public class DecorationInclusiveServiceImpl implements DecorationInclusiveService {

	@Autowired
	private DecorationInclusiveDao decorationInclusiveDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private DecorationPaymentService decorationPaymentService;

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

		DecorationInclusivePO decorationInclusivePO = decorationInclusiveDao.queryDecorationInclusiveByOrderId(orderId);
		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT };

		if (decorationInclusivePO != null) {
			
			List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationInclusiveVO.getDecoration().getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

			if (decorationPayments != null && decorationPayments.size() > 0) {
				throw new FLException(140054, "套餐信息不可更新");
			}

		} else {
			decorationInclusivePO = new DecorationInclusivePO(new DecorationPO(orderId));
		}

		QuotationPO quotation = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotation == null) {
			throw new FLException(200003, "报价不存在");
		}

		BeanUtil.copyPropertie(decorationInclusiveVO, decorationInclusivePO, Arrays.asList("decoration"));

		decorationInclusivePO.setProjectPrice(quotation.getTotalPrice());
		decorationInclusivePO.setCdiff(DecorationInclusivePO.MONEY_ZERO_FLOAT);
		decorationInclusivePO.setMdiff(DecorationInclusivePO.MONEY_ZERO_FLOAT);
		decorationInclusivePO.setMaterialPaidup(DecorationInclusivePO.MONEY_ZERO_FLOAT);
		decorationInclusivePO.setManagePrice(quotation.getManagePrice());
		decorationInclusivePO.setManageRate(quotation.getManageRate());

		decorationInclusiveDao.saveOrUpdate(decorationInclusivePO);

		DecorationPaymentVO decorationpaymentVO = new DecorationPaymentVO();

		decorationpaymentVO.setReferMoney(decorationInclusiveVO.getContractPrice());
		decorationpaymentVO.setDecoration(decorationInclusiveVO.getDecoration());
		decorationpaymentVO.setPsId(decorationInclusiveVO.getPsId());

		decorationPaymentService.makeDecorationPayment(decorationpaymentVO, userId);

		BeanUtil.copyPropertie(decorationInclusivePO, decorationInclusiveVO, Arrays.asList("decoration"));

	}

}
