package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.dao.BalanceSelectionDao;
import com.fanglin.balance.dao.BalanceSelectionItemDao;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.balance.po.BalanceSelectionBO;
import com.fanglin.balance.po.BalanceSelectionItemPO;
import com.fanglin.balance.po.BalanceSelectionPO;
import com.fanglin.balance.service.BalanceSelectionService;
import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.SelectionItemPD;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("balanceSelectionService")
@Transactional(readOnly = true)
public class BalanceSelectionServiceImpl implements BalanceSelectionService {

	@Autowired
	private BalanceSelectionDao balanceSelectionDao;

	@Autowired
	private BalanceSelectionItemDao balanceSelectionItemDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private BalanceDao balanceDao;

	@Override
	public void pageBalanceSelection(Paging paging, List<Filter> filters, int company) {

		List<BalanceSelectionPO> balanceSelectionPOs = balanceSelectionDao.pageBalanceSelection(paging, filters, company);
		List<BalanceSelectionVO> balanceSelectionVOs = new ArrayList<BalanceSelectionVO>();

		BalanceSelectionVO balanceSelectionVO;

		for (BalanceSelectionPO balanceSelectionPO : balanceSelectionPOs) {

			balanceSelectionVO = new BalanceSelectionVO(new BrandVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceSelectionPO, balanceSelectionVO, Arrays.asList("brand", "balance", "creater", "balancer"));
			BeanUtil.copyProperties(balanceSelectionPO.getCreater(), balanceSelectionVO.getCreater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyProperties(balanceSelectionPO.getBalancer(), balanceSelectionVO.getBalancer(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyPropertie(balanceSelectionPO.getBrand(), balanceSelectionVO.getBrand(), Arrays.asList("category", "supplier"));

			balanceSelectionVOs.add(balanceSelectionVO);
		}

		paging.setData(balanceSelectionVOs);
	}

	@Override
	public void pageBalanceSelectionForBalance(Paging paging, List<Filter> filters, int company) {

		List<BalanceSelectionBO> balanceSelectionBOs = balanceSelectionDao.pageBalanceSelectionForBalance(paging, filters, company);
		List<BalanceSelectionVO> balanceSelectionVOs = new ArrayList<BalanceSelectionVO>();

		BalanceSelectionVO balanceSelectionVO;

		for (BalanceSelectionBO balanceSelectionBO : balanceSelectionBOs) {

			balanceSelectionVO = new BalanceSelectionVO(new BrandVO(), new BalanceVO(new UserBaseVO(), new UserBaseVO()), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceSelectionBO, balanceSelectionVO, Arrays.asList("brand", "balance", "creater", "balancer"));
			BeanUtil.copyProperties(balanceSelectionBO.getCreater(), balanceSelectionVO.getCreater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyProperties(balanceSelectionBO.getBalancer(), balanceSelectionVO.getBalancer(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyPropertie(balanceSelectionBO.getBrand(), balanceSelectionVO.getBrand(), Arrays.asList("category", "supplier"));
			BeanUtil.copyPropertie(balanceSelectionBO.getBalance(), balanceSelectionVO.getBalance(), Arrays.asList("belonger", "creater"));
			BeanUtil.copyPropertie(balanceSelectionBO.getBalance().getBelonger(), balanceSelectionVO.getBalance().getBelonger(), Arrays.asList("duty", "dept", "role"));
			BeanUtil.copyPropertie(balanceSelectionBO.getBalance().getCreater(), balanceSelectionVO.getBalance().getCreater(), Arrays.asList("duty", "dept", "role"));

			balanceSelectionVOs.add(balanceSelectionVO);

		}

		paging.setData(balanceSelectionVOs);
	}

	@Override
	public List<BalanceSelectionVO> queryBalanceSelection(BalanceSelectionVO balanceSelectionVO, int company) {

		List<BalanceSelectionVO> balanceSelectionVOs = new ArrayList<BalanceSelectionVO>();
		List<BalanceSelectionPO> balanceSelectionPOs = balanceSelectionDao.queryBalanceSelection(balanceSelectionVO.getName(), company);

		for (BalanceSelectionPO balanceSelectionPO : balanceSelectionPOs) {

			balanceSelectionVO = new BalanceSelectionVO(new BrandVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceSelectionPO, balanceSelectionVO, Arrays.asList("brand", "balance", "creater", "balancer"));
			BeanUtil.copyPropertie(balanceSelectionPO.getBrand(), balanceSelectionVO.getBrand(), Arrays.asList("supplier"));

			balanceSelectionVOs.add(balanceSelectionVO);
		}

		return balanceSelectionVOs;
	}

	@Override
	public BalanceSelectionVO queryBalanceSelectionByBsid(BalanceSelectionVO balanceSelectionVO) {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelectionVO.getBsid());

		balanceSelectionVO = new BalanceSelectionVO(new BrandVO(), new UserBaseVO());

		BeanUtil.copyPropertie(balanceSelectionPO, balanceSelectionVO, Arrays.asList("brand", "balance", "creater", "balancer"));
		BeanUtil.copyPropertie(balanceSelectionPO.getBrand(), balanceSelectionVO.getBrand(), Arrays.asList("supplier"));
		BeanUtil.copyPropertie(balanceSelectionPO.getCreater(), balanceSelectionVO.getCreater(), Arrays.asList("dept", "duty"));

		return balanceSelectionVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId, int company) throws FLException {

		BrandPO brand = brandDao.queryBrandByBid(balanceSelectionVO.getBrand().getBid());

		BalanceSelectionPO balanceSelectionPO = new BalanceSelectionPO(brand);

		BeanUtil.copyPropertie(balanceSelectionVO, balanceSelectionPO, Arrays.asList("brand", "balance", "creater", "balancer"));

		balanceSelectionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		balanceSelectionPO.setGrade(balanceSelectionVO.getGrade());
		balanceSelectionPO.setName(balanceSelectionVO.getName());

		balanceSelectionPO.setCreater(userDao.queryUserByUserId(userId));
		balanceSelectionPO.setCompany(company);

		balanceSelectionDao.save(balanceSelectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitBalanceSelection(BalanceSelectionVO balanceSelectionVO, List<BalanceSelectionItemVO> balanceSelectionItem, String userId, int company) throws FLException {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelectionVO.getBsid());

		if (balanceSelectionPO == null) {
			throw new FLException(350027, "结算选材不存在");
		}

		if (balanceSelectionPO.getStatus() != BalanceSelectionPO.STATUS_INIT_INT) {
			throw new FLException(350028, "结算选材不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		for (BalanceSelectionItemVO balanceSelectionItemVO : balanceSelectionItem) {

			SelectionItemPO selectionItemPO = selectionItemDao.get(balanceSelectionItemVO.getSelectionItem().getSiid());

			if (selectionItemPO == null) continue;

			BalanceSelectionItemPO balanceSelectionItemPO = new BalanceSelectionItemPO();

			SelectionItemPD selectionItemPD = new SelectionItemPD(selectionItemPO.getSiid());

			balanceSelectionItemPO.setBsid(balanceSelectionVO.getBsid());
			balanceSelectionItemPO.setSelectionItem(selectionItemPD);

			balanceSelectionItemDao.save(balanceSelectionItemPO);

			selectionItemPO.setAccounter(operater);
			selectionItemPO.setAccountTime(DateUtil.getDateToTimestamp(new Date()));
			selectionItemPO.setAccountStatus(SelectionItemPO.ACCOUNT_STATUS_ACCOUNT_INT);

			selectionItemDao.update(selectionItemPO);
		}

		balanceSelectionItemDao.flush();

		long amount = balanceSelectionDao.amountBalaceSelection(balanceSelectionVO.getBsid());

		balanceSelectionPO.setIncome(balanceSelectionVO.getIncome());
		balanceSelectionPO.setCost(amount);
		balanceSelectionPO.setPayment(amount);
		balanceSelectionPO.setProfit(balanceSelectionVO.getProfit());

		balanceSelectionDao.update(balanceSelectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unbindBalanceSelection(BalanceSelectionVO balanceSelectionVO, List<BalanceSelectionItemVO> balanceSelectionItem, String userId, int company) throws FLException {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelectionVO.getBsid());

		if (balanceSelectionPO == null) {
			throw new FLException(350027, "结算选材不存在");
		}

		if (balanceSelectionPO.getStatus() != BalanceSelectionPO.STATUS_INIT_INT) {
			throw new FLException(350028, "结算选材不可操作");
		}

		for (BalanceSelectionItemVO balanceSelectionItemVO : balanceSelectionItem) {

			BalanceSelectionItemPO balanceSelectionItemPO = balanceSelectionItemDao.get(balanceSelectionItemVO.getBsiid());

			if (balanceSelectionItemPO == null) continue;

			balanceSelectionItemDao.deleteById(balanceSelectionItemVO.getBsiid());

			SelectionItemPD selectionItemPD = balanceSelectionItemPO.getSelectionItem();

			if (selectionItemPD == null) continue;

			selectionItemPD.setAccounter(null);
			selectionItemPD.setAccountTime(null);
			selectionItemPD.setAccountStatus(SelectionItemPO.ACCOUNT_STATUS_INIT_INT);

			selectionItemDao.update(selectionItemPD);
		}

		balanceSelectionItemDao.flush();

		long amount = balanceSelectionDao.amountBalaceSelection(balanceSelectionVO.getBsid());

		balanceSelectionPO.setIncome(balanceSelectionVO.getIncome());
		balanceSelectionPO.setCost(amount);
		balanceSelectionPO.setPayment(amount);
		balanceSelectionPO.setProfit(balanceSelectionVO.getProfit());

		balanceSelectionDao.update(balanceSelectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockBalanceSelection(BalanceSelectionVO balanceSelectionVO) throws FLException {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelectionVO.getBsid());

		if (balanceSelectionPO == null) {
			throw new FLException(350027, "结算选材不存在");
		}

		if (balanceSelectionPO.getStatus() != BalanceSelectionPO.STATUS_INIT_INT) {
			throw new FLException(350028, "结算选材不可操作");
		}

		balanceSelectionPO.setStatus(BalanceSelectionPO.STATUS_UNLOCK_INT);
		balanceSelectionPO.setLockTime(DateUtil.getDateToTimestamp(new Date()));

		long amount = balanceSelectionDao.amountBalaceSelection(balanceSelectionVO.getBsid());

		balanceSelectionPO.setCost(amount);
		balanceSelectionPO.setPayment(amount);

		balanceSelectionDao.update(balanceSelectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unlockBalanceSelection(BalanceSelectionVO balanceSelectionVO) throws FLException {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelectionVO.getBsid());

		if (balanceSelectionPO == null) {
			throw new FLException(350027, "结算选材不存在");
		}

		if (balanceSelectionPO.getStatus() != BalanceSelectionPO.STATUS_UNLOCK_INT) {
			throw new FLException(350028, "结算选材不可操作");
		}

		balanceSelectionPO.setStatus(BalanceSelectionPO.STATUS_INIT_INT);

		balanceSelectionDao.update(balanceSelectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateBalanceSelection(BalanceSelectionVO balanceSelection) throws FLException {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelection.getBsid());

		if (balanceSelectionPO == null) {
			throw new FLException(350027, "结算选材不存在");
		}

		if (balanceSelectionPO.getStatus() != BalanceSelectionPO.STATUS_INIT_INT) {
			throw new FLException(350028, "结算选材不可操作");
		}

		balanceSelectionPO.setName(balanceSelection.getName());

		balanceSelectionDao.update(balanceSelectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int balanceBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId) throws FLException {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelectionVO.getBsid());

		if (balanceSelectionPO == null) {
			throw new FLException(350027, "结算选材不存在");
		}

		if (balanceSelectionPO.getStatus() != BalanceSelectionPO.STATUS_UNLOCK_INT) {
			throw new FLException(350028, "结算选材不可操作");
		}

		UserPO balancer = userDao.queryUserByUserId(userId);

		balanceSelectionPO.setBalancer(balancer);
		balanceSelectionPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
		balanceSelectionPO.setStatus(BalanceSelectionPO.STATUS_ENABLE_CHECK_INT);

		balanceSelectionDao.update(balanceSelectionPO);

		BalancePO balancePO = new BalancePO(new UserPO(), new UserPO());

		CompanyPO companyPO = companyDao.get(balanceSelectionPO.getCompany());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT, currentDate, balanceSelectionPO.getCompany());

		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		balancePO.setNo(no);
		balancePO.setType(BalanceSalesPO.STATUS_INIT_INT);
		balancePO.setBelonger(balanceSelectionPO.getCreater());
		balancePO.setCreater(balanceSelectionPO.getCreater());
		balancePO.setCompany(balanceSelectionPO.getCompany());
		balancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balancePO.setAmount(balanceSelectionVO.getPayment());
		balancePO.setSurplus(balanceSelectionVO.getPayment());

		balanceDao.save(balancePO);

		balanceSelectionPO.setBid(balancePO.getBid());

		balanceSelectionDao.update(balanceSelectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteBalanceSelection(BalanceSelectionVO balanceSelection) throws FLException {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelection.getBsid());

		if (balanceSelectionPO == null) {
			throw new FLException(350027, "结算选材不存在");
		}

		if (balanceSelectionPO.getStatus() != BalanceSelectionPO.STATUS_INIT_INT) {
			throw new FLException(350028, "结算选材不可操作");
		}

		if (balanceSelectionItemDao.countBalanceSelectionItem(balanceSelection.getBsid()) > 0) {
			throw new FLException(350029, "结算选材明细存在");
		}

		balanceSelectionDao.delete(balanceSelectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int amountBalanceSelection(BalanceSelectionVO balanceSelectionVO) throws FLException {

		BalanceSelectionPO balanceSelectionPO = balanceSelectionDao.get(balanceSelectionVO.getBsid());

		if (balanceSelectionPO == null) {
			throw new FLException(350027, "结算选材不存在");
		}

		long amount = balanceSelectionDao.amountBalaceSelection(balanceSelectionVO.getBsid());

		balanceSelectionPO.setCost(amount);
		balanceSelectionPO.setPayment(amount);

		balanceSelectionDao.update(balanceSelectionPO);

		return 0;
	}

}
