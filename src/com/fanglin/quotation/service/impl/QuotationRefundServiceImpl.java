package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationRefundDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.QuotationRefundPO;
import com.fanglin.quotation.service.QuotationRefundService;
import com.fanglin.quotation.vo.QuotationRefundVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("quotationRefundService")
@Transactional(readOnly = true)
public class QuotationRefundServiceImpl implements QuotationRefundService {

	@Autowired
	private QuotationRefundDao quotationRefundDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageQuotationRefund(Paging paging, List<Filter> filters, Integer company) throws FLException {

		if (filters.size() == 0) return;

		List<QuotationRefundPO> quotationRefundPOs = quotationRefundDao.pageQuotationRefund(paging, filters, company);

		List<QuotationRefundVO> quotationRefundVOs = new ArrayList<QuotationRefundVO>();

		for (QuotationRefundPO quotationRefundPO : quotationRefundPOs) {

			quotationRefundVOs.add(quotationRefundPO.ptv(new QuotationRefundVO(new DecorationVO(), new QuotationVO(), new QuotationVersionVO(), new UserBaseVO())));
		}

		paging.setData(quotationRefundVOs);
	}

	@Override
	public QuotationRefundVO queryQuotationRefundById(QuotationRefundVO quotationRefundVO) throws FLException {

		QuotationRefundPO quotationRefundPO = quotationRefundDao.get(quotationRefundVO.getQrid());

		return quotationRefundPO.ptv(new QuotationRefundVO(new DecorationVO(), new QuotationVO(), new QuotationVersionVO(), new UserBaseVO()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationRefund(QuotationRefundVO quotationRefundVO, String userId) throws FLException {

		QuotationRefundPO quotationRefundPO = new QuotationRefundPO();

		QuotationRefundPO quotationRefund = quotationRefundDao.queryQuotationRefundByQid(quotationRefundVO.getQuotation().getQid());

		if (quotationRefund != null) {
			throw new FLException(200099, "退报单已存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationRefundVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		QuotationPO quotationPO = quotationDao.get(quotationRefundVO.getQuotation().getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionByQvId(quotationPO.getVersion().getQvId());

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		BeanUtil.copyPropertie(quotationRefundVO, quotationRefundPO, Arrays.asList("decoration", "quotation", "version", "creater"));

		quotationRefundPO.setDecoration(decorationPO);
		quotationRefundPO.setQuotation(quotationPO);
		quotationRefundPO.setVersion(quotationVersionPO);

		quotationRefundPO.setCreater(userDao.queryUserByUserId(userId));
		quotationRefundPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		quotationRefundDao.save(quotationRefundPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationRefund(QuotationRefundVO quotationRefundVO) throws FLException {

		QuotationRefundPO quotationRefundPO = quotationRefundDao.get(quotationRefundVO.getQrid());

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationRefundPO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		QuotationPO quotationPO = quotationDao.get(quotationRefundPO.getQuotation().getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		quotationRefundPO.setTotalPrice(quotationRefundVO.getTotalPrice());

		quotationRefundDao.update(quotationRefundPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationRefund(QuotationRefundVO quotationRefundVO) throws FLException {

		QuotationRefundPO quotationRefundPO = quotationRefundDao.get(quotationRefundVO.getQrid());

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationRefundVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		quotationRefundDao.delete(quotationRefundPO);

		return 0;
	}

}
