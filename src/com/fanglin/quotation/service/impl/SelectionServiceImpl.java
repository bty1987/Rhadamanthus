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
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.SelectionDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.SelectionDO;
import com.fanglin.quotation.po.SelectionPO;
import com.fanglin.quotation.service.SelectionService;
import com.fanglin.quotation.vo.SelectionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("selectionService")
@Transactional(readOnly = true)
public class SelectionServiceImpl implements SelectionService {

	@Autowired
	private SelectionDao selectionDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageSelection(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<SelectionDO> selectionDOs = selectionDao.pageSelection(paging, filters, company);

		List<SelectionVO> selectionVOs = new ArrayList<SelectionVO>();

		for (SelectionDO selectionDO : selectionDOs) {

			SelectionVO selectionVO = new SelectionVO(new DecorationVO(), new UserBaseVO());

			selectionVO.getDecoration().setSupervisor(new UserBaseVO());

			BeanUtil.copyPropertie(selectionDO, selectionVO, Arrays.asList("decoration", "creater"));

			BeanUtil.copyProperties(selectionDO.getCreater(), selectionVO.getCreater(), Arrays.asList("duty", "dept", "role"));

			selectionDO.getDecoration().ptvcascade(selectionVO.getDecoration());

			selectionVOs.add(selectionVO);
		}
		paging.setData(selectionVOs);

	}

	@Override
	public SelectionVO querySelectionByQid(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.querySelectionByQid(selectionVO.getQid());

		if (selectionPO == null) return null;

		selectionVO = new SelectionVO();

		BeanUtil.copyProperties(selectionPO, selectionVO, Arrays.asList("creater"));

		return selectionVO;
	}

	@Override
	public SelectionVO querySelectionByOrderId(SelectionVO selectionVO) throws FLException {

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(selectionVO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200017, "默认报价不存在");
		}

		SelectionPO selectionPO = selectionDao.querySelectionByQid(quotationPO.getQid());

		if (selectionPO == null) return null;

		selectionVO = new SelectionVO();

		BeanUtil.copyProperties(selectionPO, selectionVO, Arrays.asList("creater"));

		return selectionVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public SelectionVO addSelection(SelectionVO selectionVO, String userId) throws FLException {

		SelectionPO selectionPO = saveSelection(selectionVO.getQid(), userId);

		BeanUtil.copyProperties(selectionPO, selectionVO, Arrays.asList("creater"));

		selectionPO.setCreater(userDao.queryUserByUserId(userId));
		selectionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		return selectionVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSelection(Long qid, String userId) throws FLException {

		saveSelection(qid, userId);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSelectionForAdvance(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		BeanUtil.copyProperties(selectionVO, selectionPO, Arrays.asList("creater"));

		selectionDao.update(selectionPO);

		return 0;
	}

	private SelectionPO saveSelection(Long qid, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(qid);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		SelectionPO selectionPO = new SelectionPO();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());

		selectionPO.setCompany(decorationPO.getCompany());
		selectionPO.setOrderId(quotationPO.getOrderId());
		selectionPO.setQid(quotationPO.getQid());
		selectionPO.setStatus(SelectionPO.STATUS_INIT_INT);
		selectionPO.setTotal(0L);

		selectionPO.setCreater(userDao.queryUserByUserId(userId));
		selectionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		selectionDao.save(selectionPO);

		return selectionPO;
	}
}
