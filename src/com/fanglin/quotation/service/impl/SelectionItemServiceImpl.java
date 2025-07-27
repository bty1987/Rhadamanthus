package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.material.vo.SoodsVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.SelectionDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.SelectionItemPD;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.quotation.po.SelectionPO;
import com.fanglin.quotation.service.SelectionItemService;
import com.fanglin.quotation.vo.SelectionItemVO;
import com.fanglin.quotation.vo.SelectionVO;
import com.fanglin.right.dao.SelectionItemStatusRightDao;
import com.fanglin.right.po.SelectionItemStatusRightPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("selectionItemService")
@Transactional(readOnly = true)
public class SelectionItemServiceImpl implements SelectionItemService {

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private SelectionDao selectionDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private ExtensionItemDao extensionItemDao;

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SelectionItemStatusRightDao selectionItemStatusRightDao;

	@Override
	public void pageSelectionItem(Paging paging, List<Filter> filters, Integer company, SelectionItemVO selectionItemVO) throws FLException {

		List<SelectionItemPD> selectionItemPDs = selectionItemDao.pageSelectionItem(paging, filters, selectionItemVO.getStatus(), company);
		List<SelectionItemVO> selectionItemVOs = ptv(selectionItemPDs);

		paging.setData(selectionItemVOs);
	}

	@Override
	public void pageSelectionItemForSupplier(Paging paging, List<Filter> filters, String userId, Integer company) throws FLException {

		UserPO createrPO = userDao.queryUserByUserId(userId);

		List<SelectionItemPD> selectionItemPDs = selectionItemDao.pageSelectionItemForSupplier(paging, filters, createrPO.getUid(), company);
		List<SelectionItemVO> selectionItemVOs = ptv(selectionItemPDs);

		paging.setData(selectionItemVOs);
	}

	@Override
	public void pageSelectionItemForEscorter(Paging paging, List<Filter> filters, String userId) throws FLException {

		List<SelectionItemPD> selectionItemPDs = selectionItemDao.pageSelectionItemForEscorter(paging, filters, userId);
		List<SelectionItemVO> selectionitemVOs = ptv(selectionItemPDs);

		paging.setData(selectionitemVOs);
	}

	@Override
	public void pageSelectionItemForAccount(Paging paging, List<Filter> filters, Integer company) throws FLException {

		if (filters.size() == 0) return;

		List<SelectionItemPD> selectionItemPDs = selectionItemDao.pageSelectionItemForAccount(paging, filters, company);
		List<SelectionItemVO> selectionItemVOs = ptv(selectionItemPDs);

		paging.setData(selectionItemVOs);

	}

	@Override
	public List<SelectionItemVO> querySelectionItem(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		List<SelectionItemPO> selectionItemPOs = selectionItemDao.querySelectionItem(selectionPO.getSid());
		List<SelectionItemVO> selectionItemVOs = new ArrayList<SelectionItemVO>();

		for (SelectionItemPO selectionItemPO : selectionItemPOs) {
			SelectionItemVO _selectionItemVO = new SelectionItemVO(new GoodsVO());

			selectionItemPO.ptv(_selectionItemVO);

			selectionItemVOs.add(_selectionItemVO);
		}

		return selectionItemVOs;
	}

	@Override
	public List<SelectionItemVO> querySelectionItemByOrderId(SelectionItemVO selectionItemVO) throws FLException {

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(selectionItemVO.getDecoration().getOrderId());

		if (quotationPO == null) {
			throw new FLException(200017, "默认报价不存在");
		}

		List<SelectionItemVO> selectionItemVOs = null;

		SelectionPO selectionPO = selectionDao.querySelectionByQid(quotationPO.getQid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		List<SelectionItemPD> selectionItemPOs = selectionItemDao.querySelectionItemDBySid(selectionPO.getSid());

		selectionItemVOs = ptv(selectionItemPOs);

		return selectionItemVOs;
	}

	@Override
	public int collateSelectionItem(SelectionVO selectionVO) throws FLException {

		List<Short> statuses = Arrays.asList(SelectionItemPO.STATUS_INIT_SHORT, SelectionItemPO.STATUS_TRAN_SHORT, SelectionItemPO.STATUS_CHECK_SHORT, SelectionItemPO.STATUS_CONFIRM_SHORT, SelectionItemPO.STATUS_FINISH_SHORT);

		int count = selectionItemDao.countSelectionItem(selectionVO.getOrderId(), statuses);

		if (count > 0) {
			throw new FLException(200039, "选材项状态不可操作");
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSelectionItem(SelectionVO selectionVO, SelectionItemVO selectionItemVO, String userId, Integer company) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		if (selectionItemVO.getType() == SelectionItemPO.TYPE_QUOTATION_SHORT && extensionItemDao.countExtensionItem(selectionItemVO.getAreaId(), selectionItemVO.getQuoteId()) != 0) {
			throw new FLException(200037, "存在关联选材项");
		}

		GoodsPO goodsPO = goodsDao.get(selectionItemVO.getGoods().getGid());
		BrandPO brandPO = brandDao.get(goodsPO.getBid());

		UserPO operater = userDao.queryUserByUserId(userId);

		long suid = brandPO.getSupplier().getUid();

		SelectionItemPO selectionItemPO = selectionItemDao.querySelectionItem(selectionVO.getSid(), selectionItemVO.getAreaId(), selectionItemVO.getQuoteId(), selectionItemVO.getType());

		List<SelectionItemStatusRightPO> rights = selectionItemStatusRightDao.querySelectionItemStatusRight(brandPO.getBid());

		if (selectionItemPO == null) {

			QuotationItemPO quotationItemPO = quotationItemDao.get(selectionItemVO.getQiid());

			if (quotationItemPO == null) {
				throw new FLException(200013, "报价项不存在");
			}

			SelectionItemPO selectionItemNO = new SelectionItemPO();

			BeanUtil.copyProperties(selectionItemVO, selectionItemNO, Arrays.asList("goods"));

			selectionItemNO.setGoods(goodsPO);
			selectionItemNO.setSuid(suid);
			selectionItemNO.setSid(selectionVO.getSid());
			selectionItemNO.setOrderId(selectionPO.getOrderId());
			selectionItemNO.setStatus(SelectionItemPO.STATUS_INIT_SHORT);
			selectionItemNO.setCompany(company);
			selectionItemNO.setCreater(operater);
			selectionItemNO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			selectionItemNO.setSgid(selectionItemVO.getSoods().getSid());
			selectionItemNO.setQiid(selectionItemVO.getQiid());

			selectionItemNO.setPreprice(quotationItemPO.getUnitPrice());

			if (rights != null && rights.size() != 0) {
				checkSelectionItem(selectionItemNO, rights, SelectionItemPO.STATUS_INIT_SHORT, operater);
			}

			selectionItemDao.save(selectionItemNO);

			selectionItemPO = selectionItemNO;

		} else if (selectionItemPO.getType() == SelectionItemPO.TYPE_ALONE_SHORT) {

			selectionItemPO.setQuoteId(selectionItemVO.getQuoteId());
			selectionItemPO.setSgid(selectionItemVO.getSoods().getSid());
			selectionItemPO.setQiid(selectionItemVO.getQiid());

			selectionItemDao.update(selectionItemPO);
		} else {

			if (selectionItemPO.getStatus() != SelectionItemPO.STATUS_INIT_SHORT) {
				throw new FLException(200039, "选材项状态不可操作");
			}

			if (selectionItemPO.getGoods().getGid() != goodsPO.getGid()) {

				selectionItemPO.setSuid(suid);
				selectionItemPO.setGoods(goodsPO);
				selectionItemPO.setPostprice(selectionItemVO.getPostprice());

				if (rights != null && rights.size() != 0) {
					checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_INIT_SHORT, operater);
				}
			} else if (selectionItemPO.getGoods().getGid() == goodsPO.getGid()) {

				selectionItemPO.setPostprice(selectionItemVO.getPostprice());
			}

			selectionItemDao.update(selectionItemPO);
		}

		BeanUtil.copyProperties(selectionVO, selectionPO, Arrays.asList("decoration", "creater", "splitter", "traner"));

		selectionDao.update(selectionPO);

		selectionItemPO.ptv(selectionItemVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSelectionItem(SelectionItemVO selectionItemVO) throws FLException {

		SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

		if (selectionItemPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		if (selectionItemPO.getStatus() > SelectionItemPO.STATUS_CHECK_SHORT) {
			throw new FLException(200039, "选材项状态不可操作");
		}

		AddReducePO addReducePO = null;

		if (selectionItemPO.getType() == SelectionItemPO.TYPE_ADDITEM_SHORT) {
			addReducePO = addReduceDao.get(selectionItemPO.getAreaId());
		}

		if (addReducePO != null && AddReducePO.PAYTYPE_PAY_INT == addReducePO.getPaytype() && !Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT).contains(addReducePO.getStatus())) {
			throw new FLException(140035, "增减项状态不可操作");
		}

		BrandPO brandPO = brandDao.queryBrandByBid(selectionItemPO.getGoods().getBid());

		if (brandPO.getCategory().getIsLimit() == CategoryPO.ISLIMIT_LIMIT_INT && selectionItemVO.getNum() > selectionItemPO.getInitNum()) {
			throw new FLException(200044, "拆单量不足");
		}

		updateSelectionTotal(selectionItemPO, selectionItemVO.getNum());

		selectionItemPO.setNum(selectionItemVO.getNum());

		if (selectionItemVO.getComment() != null) {
			selectionItemPO.setComment(selectionItemVO.getComment());
		}

		selectionItemDao.update(selectionItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int tranSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException {

		UserPO traner = userDao.queryUserByUserId(userId);

		for (SelectionItemVO selectionItemVO : selectionItemVOs) {

			SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

			if (selectionItemPO == null) {
				throw new FLException(200038, "选材项不存在");
			}

			if (selectionItemPO.getStatus() != SelectionItemPO.STATUS_INIT_SHORT) {
				throw new FLException(200039, "选材项状态不可操作");
			}

			AddReducePO addReducePO = null;

			if (selectionItemPO.getType() == SelectionItemPO.TYPE_ADDITEM_SHORT) {
				addReducePO = addReduceDao.get(selectionItemPO.getAreaId());
			}

			if (addReducePO != null && AddReducePO.PAYTYPE_PAY_INT == addReducePO.getPaytype() && !Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT).contains(addReducePO.getStatus())) {
				throw new FLException(140035, "增减项状态不可操作");
			}

			selectionItemPO.setTraner(traner);
			selectionItemPO.setTranTime(DateUtil.getDateToTimestamp(new Date()));
			selectionItemPO.setStatus(SelectionItemPO.STATUS_TRAN_SHORT);

			List<SelectionItemStatusRightPO> rights = selectionItemStatusRightDao.querySelectionItemStatusRight(selectionItemPO.getGoods().getBid());

			if (rights != null && rights.size() != 0) {
				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_TRAN_SHORT, traner);
			}

			selectionItemDao.update(selectionItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int checkSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException {

		UserPO checker = userDao.queryUserByUserId(userId);

		for (SelectionItemVO selectionItemVO : selectionItemVOs) {

			SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

			if (selectionItemPO == null) {
				throw new FLException(200038, "选材项不存在");
			}

			if (selectionItemPO.getStatus() != SelectionItemPO.STATUS_TRAN_SHORT) {
				throw new FLException(200039, "选材项状态不可操作");
			}

			AddReducePO addReducePO = null;

			if (selectionItemPO.getType() == SelectionItemPO.TYPE_ADDITEM_SHORT) {
				addReducePO = addReduceDao.get(selectionItemPO.getAreaId());
			}

			if (addReducePO != null && AddReducePO.PAYTYPE_PAY_INT == addReducePO.getPaytype() && !Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT).contains(addReducePO.getStatus())) {
				throw new FLException(140035, "增减项状态不可操作");
			}

			if (selectionItemVO.getChecker() != null) {
				checker = userDao.get(selectionItemVO.getChecker().getUid());
			}

			selectionItemPO.setChecker(checker);
			selectionItemPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));
			selectionItemPO.setStatus(SelectionItemPO.STATUS_CHECK_SHORT);

			List<SelectionItemStatusRightPO> rights = selectionItemStatusRightDao.querySelectionItemStatusRight(selectionItemPO.getGoods().getBid());

			if (rights != null && rights.size() != 0) {
				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_CHECK_SHORT, checker);
			}

			selectionItemDao.update(selectionItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException {

		UserPO confirmer = userDao.queryUserByUserId(userId);

		for (SelectionItemVO selectionItemVO : selectionItemVOs) {

			SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

			if (selectionItemPO == null) {
				throw new FLException(200038, "选材项不存在");
			}

			if (selectionItemPO.getStatus() != SelectionItemPO.STATUS_CHECK_SHORT) {
				throw new FLException(200039, "选材项状态不可操作");
			}

			AddReducePO addReducePO = null;

			if (selectionItemPO.getType() == SelectionItemPO.TYPE_ADDITEM_SHORT) {
				addReducePO = addReduceDao.get(selectionItemPO.getAreaId());
			}

			if (addReducePO != null && AddReducePO.PAYTYPE_PAY_INT == addReducePO.getPaytype() && !Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT).contains(addReducePO.getStatus())) {
				throw new FLException(140035, "增减项状态不可操作");
			}

			selectionItemPO.setConfirmer(confirmer);
			selectionItemPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
			selectionItemPO.setStatus(SelectionItemPO.STATUS_CONFIRM_SHORT);

			List<SelectionItemStatusRightPO> rights = selectionItemStatusRightDao.querySelectionItemStatusRight(selectionItemPO.getGoods().getBid());

			if (rights != null && rights.size() != 0) {
				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_CONFIRM_SHORT, confirmer);
			}

			selectionItemDao.update(selectionItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException {

		UserPO finish = userDao.queryUserByUserId(userId);

		for (SelectionItemVO selectionItemVO : selectionItemVOs) {

			SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

			if (selectionItemPO == null) {
				throw new FLException(200038, "选材项不存在");
			}

			if (SelectionItemPO.STATUS_CONFIRM_SHORT != selectionItemPO.getStatus()) {
				throw new FLException(200039, "选材项状态不可操作");
			}

			AddReducePO addReducePO = null;

			if (selectionItemPO.getType() == SelectionItemPO.TYPE_ADDITEM_SHORT) {
				addReducePO = addReduceDao.get(selectionItemPO.getAreaId());
			}

			if (addReducePO != null && AddReducePO.PAYTYPE_PAY_INT == addReducePO.getPaytype() && !Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT).contains(addReducePO.getStatus())) {
				throw new FLException(140035, "增减项状态不可操作");
			}

			selectionItemPO.setFinish(finish);
			selectionItemPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
			selectionItemPO.setStatus(SelectionItemPO.STATUS_FINISH_SHORT);

			if (selectionItemVO.getRefnum() != null && selectionItemVO.getRefnum() < 0) {
				throw new FLException(200044, "拆单量不足");
			}

			if (selectionItemVO.getRefnum() != null && selectionItemVO.getRefnum() > selectionItemPO.getNum()) {
				throw new FLException(200044, "拆单量不足");
			}

			if (selectionItemVO.getRefnum() != null) {
				selectionItemPO.setRefnum(selectionItemVO.getRefnum());
			}

			List<SelectionItemStatusRightPO> rights = selectionItemStatusRightDao.querySelectionItemStatusRight(selectionItemPO.getGoods().getBid());

			if (rights != null && rights.size() != 0) {
				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_FINISH_SHORT, finish);
			}

			selectionItemDao.update(selectionItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int reviewSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException {

		UserPO reviewer = userDao.queryUserByUserId(userId);

		for (SelectionItemVO selectionItemVO : selectionItemVOs) {

			SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

			if (selectionItemPO == null) {
				throw new FLException(200038, "选材项不存在");
			}

			if (SelectionItemPO.STATUS_FINISH_SHORT != selectionItemPO.getStatus()) {
				throw new FLException(200039, "选材项状态不可操作");
			}

			AddReducePO addReducePO = null;

			if (selectionItemPO.getType() == SelectionItemPO.TYPE_ADDITEM_SHORT) {
				addReducePO = addReduceDao.get(selectionItemPO.getAreaId());
			}

			if (addReducePO != null && AddReducePO.PAYTYPE_PAY_INT == addReducePO.getPaytype() && !Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT).contains(addReducePO.getStatus())) {
				throw new FLException(140035, "增减项状态不可操作");
			}

			selectionItemPO.setReviewer(reviewer);
			selectionItemPO.setReviewTime(DateUtil.getDateToTimestamp(new Date()));
			selectionItemPO.setStatus(SelectionItemPO.STATUS_REVIEW_SHORT);

			List<SelectionItemStatusRightPO> rights = selectionItemStatusRightDao.querySelectionItemStatusRight(selectionItemPO.getGoods().getBid());

			if (rights != null && rights.size() != 0) {
				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_REVIEW_SHORT, reviewer);
			}

			selectionItemDao.update(selectionItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int balanceSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException {

		UserPO balancer = userDao.queryUserByUserId(userId);

		for (SelectionItemVO selectionItemVO : selectionItemVOs) {

			SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

			if (selectionItemPO == null) {
				throw new FLException(200038, "选材项不存在");
			}

			if (SelectionItemPO.STATUS_REVIEW_SHORT != selectionItemPO.getStatus()) {
				throw new FLException(200039, "选材项状态不可操作");
			}

			AddReducePO addReducePO = null;

			if (selectionItemPO.getType() == SelectionItemPO.TYPE_ADDITEM_SHORT) {
				addReducePO = addReduceDao.get(selectionItemPO.getAreaId());
			}

			if (addReducePO != null && AddReducePO.PAYTYPE_PAY_INT == addReducePO.getPaytype() && !Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT).contains(addReducePO.getStatus())) {
				throw new FLException(140035, "增减项状态不可操作");
			}

			selectionItemPO.setBalancer(balancer);
			selectionItemPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
			selectionItemPO.setStatus(SelectionItemPO.STATUS_BALANCE_SHORT);

			List<SelectionItemStatusRightPO> rights = selectionItemStatusRightDao.querySelectionItemStatusRight(selectionItemPO.getGoods().getBid());

			if (rights != null && rights.size() != 0) {
				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_BALANCE_SHORT, balancer);
			}

			selectionItemDao.update(selectionItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundSelectionItem(SelectionItemVO selectionItemVO) throws FLException {

		SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

		if (selectionItemPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		if (Arrays.asList(SelectionItemPO.STATUS_REVIEW_SHORT, SelectionItemPO.STATUS_BALANCE_SHORT).contains(selectionItemPO.getStatus())) {
			throw new FLException(200039, "选材项状态不可操作");
		}

		if (Arrays.asList(SelectionItemPO.TYPE_EXTENSIONMINUS_SHORT, SelectionItemPO.TYPE_MINUSITEM_SHORT).contains(selectionItemPO.getType())) {
			throw new FLException(200039, "选材项状态不可操作");
		}

		if (selectionItemVO.getRefnum() != null && selectionItemVO.getRefnum() < 0) {
			throw new FLException(200044, "拆单量不足");
		}

		if (selectionItemVO.getRefnum() != null && selectionItemVO.getRefnum() > selectionItemPO.getNum()) {
			throw new FLException(200044, "拆单量不足");
		}

		if (selectionItemVO.getRefnum() != null) {
			selectionItemPO.setRefnum(selectionItemVO.getRefnum());
		}

		selectionItemPO.setRefnum(selectionItemVO.getRefnum());

		selectionItemDao.update(selectionItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSelectionItem(SelectionVO selectionVO, SelectionItemVO selectionItemVO) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

		if (selectionItemPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		if (Arrays.asList(SelectionItemPO.STATUS_REVIEW_SHORT, SelectionItemPO.STATUS_BALANCE_SHORT).contains(selectionItemPO.getStatus())) {
			throw new FLException(200039, "选材项状态不可操作");
		}

		if (selectionItemPO.getAccountStatus() != SelectionItemPO.ACCOUNT_STATUS_INIT_INT) {
			throw new FLException(200039, "选材项状态不可操作");
		}

		selectionItemDao.delete(selectionItemPO);

		updateSelectionTotal(selectionItemPO, selectionItemPO.getNum());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cutoffSelectionItem(SelectionItemVO selectionItemVO) throws FLException {

		SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

		if (selectionItemPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		if (Arrays.asList(SelectionItemPO.STATUS_REVIEW_SHORT, SelectionItemPO.STATUS_BALANCE_SHORT).contains(selectionItemPO.getStatus())) {
			throw new FLException(200039, "选材项状态不可操作");
		}

		selectionItemPO.setStatus(SelectionItemPO.STATUS_DISABLE_SHORT);

		selectionItemDao.update(selectionItemPO);

		updateSelectionTotal(selectionItemPO, selectionItemPO.getNum());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rejectSelectionItem(SelectionItemVO selectionItemVO) throws FLException {

		SelectionItemPO selectionItemPO = selectionItemDao.get(selectionItemVO.getSiid());

		if (selectionItemPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		if (!Arrays.asList(SelectionItemPO.STATUS_REVIEW_SHORT, SelectionItemPO.STATUS_BALANCE_SHORT).contains(selectionItemPO.getStatus())) {
			throw new FLException(200039, "选材项状态不可操作");
		}

		if (selectionItemPO.getAccountStatus() != SelectionItemPO.ACCOUNT_STATUS_INIT_INT) {
			throw new FLException(200039, "选材项状态不可操作");
		}

		selectionItemPO.setStatus(SelectionItemPO.STATUS_FINISH_SHORT);

		selectionItemDao.update(selectionItemPO);

		return 0;
	}

	private List<SelectionItemVO> ptv(List<SelectionItemPD> selectionItemPDs) throws FLException {

		List<SelectionItemVO> selectionItemVOs = new ArrayList<SelectionItemVO>();

		for (SelectionItemPD selectionItemPD : selectionItemPDs) {

			SelectionItemVO selectionItemVO = new SelectionItemVO(new SelectionVO(), new GoodsVO(), new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new SoodsVO());

			selectionItemVO.getDecoration().setSupervisor(new UserBaseVO());
			selectionItemVO.getDecoration().setEscorter(new UserBaseVO());
			selectionItemVO.getDecoration().setMaterialer(new UserBaseVO());

			selectionItemVOs.add(selectionItemPD.ptv(selectionItemVO));
		}

		return selectionItemVOs;
	}

	@Transactional(rollbackFor = Exception.class)
	private void updateSelectionTotal(SelectionItemPO selectionItemPO, Integer newNum) {

		SelectionPO selectionPO = selectionDao.get(selectionItemPO.getSid());

		int newSelling = Arith.mul(newNum, selectionItemPO.getPostprice());
		int oldSelling = Arith.mul(selectionItemPO.getNum(), selectionItemPO.getPostprice());

		switch (selectionItemPO.getType()) {
			case SelectionItemPO.TYPE_QUOTATION_SHORT:
				selectionPO.setQuotationTotal(Arith.add(Arith.sub(selectionPO.getQuotationTotal(), oldSelling), newSelling));
				break;
			case SelectionItemPO.TYPE_EXTENSIONADD_SHORT:
				selectionPO.setExtensionAddTotal(Arith.add(Arith.sub(selectionPO.getExtensionAddTotal(), oldSelling), newSelling));
				break;
			case SelectionItemPO.TYPE_EXTENSIONMINUS_SHORT:
				selectionPO.setExtensionReduceTotal(Arith.add(Arith.sub(selectionPO.getExtensionReduceTotal(), oldSelling), newSelling));
				break;
			case SelectionItemPO.TYPE_ADDITEM_SHORT:
				selectionPO.setAddReduceAddTotal(Arith.add(Arith.sub(selectionPO.getAddReduceAddTotal(), oldSelling), newSelling));
				break;
			case SelectionItemPO.TYPE_MINUSITEM_SHORT:
				selectionPO.setAddReduceMinusTotal(Arith.add(Arith.sub(selectionPO.getAddReduceMinusTotal(), oldSelling), newSelling));
				break;
		}

		long addTotal = Arith.add(Arith.add(selectionPO.getQuotationTotal(), selectionPO.getExtensionAddTotal()), selectionPO.getAddReduceAddTotal());
		long subTotal = Arith.add(selectionPO.getAddReduceMinusTotal(), selectionPO.getExtensionReduceTotal());

		selectionPO.setTotal(Arith.sub(addTotal, subTotal));

		selectionDao.update(selectionPO);
	}

	private void checkSelectionItem(SelectionItemPO selectionItemPO, List<SelectionItemStatusRightPO> rights, Short status, UserPO userPO) {

		List<Short> statuses = new ArrayList<Short>();

		for (SelectionItemStatusRightPO selectionItemStatusRightPO : rights) {
			statuses.add(selectionItemStatusRightPO.getStatus());
		}

		if (!statuses.contains(status)) return;

		switch (status) {
			case SelectionItemPO.STATUS_INIT_SHORT:

				selectionItemPO.setStatus(SelectionItemPO.STATUS_TRAN_SHORT);
				selectionItemPO.setTraner(userPO);
				selectionItemPO.setTranTime(DateUtil.getDateToTimestamp(new Date()));

				selectionItemPO.setNum(selectionItemPO.getInitNum());

				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_TRAN_SHORT, userPO);

				break;
			case SelectionItemPO.STATUS_TRAN_SHORT:

				selectionItemPO.setStatus(SelectionItemPO.STATUS_CHECK_SHORT);
				selectionItemPO.setChecker(userPO);
				selectionItemPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_CHECK_SHORT, userPO);

				break;
			case SelectionItemPO.STATUS_CHECK_SHORT:

				selectionItemPO.setStatus(SelectionItemPO.STATUS_CONFIRM_SHORT);
				selectionItemPO.setConfirmer(userPO);
				selectionItemPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));

				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_CONFIRM_SHORT, userPO);

				break;
			case SelectionItemPO.STATUS_CONFIRM_SHORT:

				selectionItemPO.setStatus(SelectionItemPO.STATUS_FINISH_SHORT);
				selectionItemPO.setFinish(userPO);
				selectionItemPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_FINISH_SHORT, userPO);

				break;
			case SelectionItemPO.STATUS_FINISH_SHORT:

				selectionItemPO.setStatus(SelectionItemPO.STATUS_REVIEW_SHORT);
				selectionItemPO.setReviewer(userPO);
				selectionItemPO.setReviewTime(DateUtil.getDateToTimestamp(new Date()));

				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_REVIEW_SHORT, userPO);

				break;
			case SelectionItemPO.STATUS_REVIEW_SHORT:

				selectionItemPO.setStatus(SelectionItemPO.STATUS_BALANCE_SHORT);
				selectionItemPO.setBalancer(userPO);
				selectionItemPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));

				checkSelectionItem(selectionItemPO, rights, SelectionItemPO.STATUS_BALANCE_SHORT, userPO);

				break;
			case SelectionItemPO.STATUS_BALANCE_SHORT:

				break;
		}
	}

}
