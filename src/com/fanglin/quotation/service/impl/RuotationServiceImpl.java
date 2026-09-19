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
import com.fanglin.quotation.dao.RuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.RuotationPO;
import com.fanglin.quotation.service.RuotationService;
import com.fanglin.quotation.vo.RuotationVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("ruotationService")
@Transactional(readOnly = true)
public class RuotationServiceImpl implements RuotationService {

	@Autowired
	private RuotationDao ruotationDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageRuotation(Paging paging, List<Filter> filters, Integer company) throws FLException {

		if (filters.size() == 0) return;

		List<RuotationPO> ruotationPOs = ruotationDao.pageRuotation(paging, filters, company);

		List<RuotationVO> ruotationVOs = new ArrayList<RuotationVO>();

		for (RuotationPO ruotationPO : ruotationPOs) {

			ruotationVOs.add(ruotationPO.ptv(new RuotationVO(new DecorationVO(), new QuotationVO(), new QuotationVersionVO(), new UserBaseVO())));
		}

		paging.setData(ruotationVOs);
	}

	@Override
	public RuotationVO queryRuotationById(RuotationVO ruotationVO) throws FLException {

		RuotationPO ruotationPO = ruotationDao.get(ruotationVO.getQrid());

		if (ruotationPO == null) {
			throw new FLException(200126, "退报单不存在");
		}

		return ruotationPO.ptv(new RuotationVO(new DecorationVO(), new QuotationVO(), new QuotationVersionVO(), new UserBaseVO()));
	}

	@Override
	public RuotationVO queryRuotationByOrderId(RuotationVO ruotationVO) throws FLException {

		RuotationPO ruotationPO = ruotationDao.queryRuotationByOrderId(ruotationVO.getDecoration().getOrderId(), Arrays.asList(RuotationPO.STATUS_INIT_INT, RuotationPO.STATUS_SUBMIT_INT, RuotationPO.STATUS_EFFECT_INT));

		if (ruotationPO == null) {
			return null;
		}

		return ruotationPO.ptv(new RuotationVO(new DecorationVO(), new QuotationVO(), new QuotationVersionVO(), new UserBaseVO()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addRuotation(RuotationVO ruotationVO, String userId) throws FLException {

		RuotationPO ruotationPO = new RuotationPO();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(ruotationVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		RuotationPO ruotation = ruotationDao.queryRuotationByOrderId(decorationPO.getOrderId(), Arrays.asList(RuotationPO.STATUS_INIT_INT, RuotationPO.STATUS_SUBMIT_INT, RuotationPO.STATUS_EFFECT_INT));

		if (ruotation != null) {
			throw new FLException(200112, "退报单已存在");
		}

		QuotationPO quotationPO = quotationDao.get(ruotationVO.getQuotation().getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionByQvId(quotationPO.getVersion().getQvId());

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		BeanUtil.copyPropertie(ruotationVO, ruotationPO, Arrays.asList("decoration", "quotation", "version", "creater", "status"));

		ruotationPO.setDecoration(decorationPO);
		ruotationPO.setQuotation(quotationPO);
		ruotationPO.setVersion(quotationVersionPO);

		ruotationPO.setCreater(userDao.queryUserByUserId(userId));
		ruotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		ruotationPO.setStatus(RuotationPO.STATUS_INIT_INT);

		ruotationDao.save(ruotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRuotation(RuotationVO ruotationVO) throws FLException {

		RuotationPO ruotationPO = ruotationDao.get(ruotationVO.getQrid());

		if (ruotationPO == null) {
			throw new FLException(200126, "退报单不存在");
		}

		if (ruotationPO.getStatus() != RuotationPO.STATUS_INIT_INT) {
			throw new FLException(200125, "退报单状态不可操作");
		}

		ruotationPO.setTotalPrice(ruotationVO.getTotalPrice());

		ruotationDao.update(ruotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteRuotation(RuotationVO ruotationVO) throws FLException {

		RuotationPO ruotationPO = ruotationDao.get(ruotationVO.getQrid());

		if (ruotationPO == null) {
			throw new FLException(200126, "退报单不存在");
		}

		if (ruotationPO.getStatus() != RuotationPO.STATUS_INIT_INT) {
			throw new FLException(200125, "退报单状态不可操作");
		}

		ruotationDao.delete(ruotationPO);

		return 0;
	}

}
