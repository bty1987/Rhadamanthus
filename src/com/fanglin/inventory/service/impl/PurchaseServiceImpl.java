package com.fanglin.inventory.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.PurchaseDao;
import com.fanglin.inventory.dao.PurchaseItemDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.PurchaseItemPO;
import com.fanglin.inventory.po.PurchasePO;
import com.fanglin.inventory.service.PurchaseService;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesPurchaseDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesPurchasePO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("purchaseService")
@Transactional(readOnly = true)
public class PurchaseServiceImpl implements PurchaseService {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private PurchaseDao purchaseDao;

	@Autowired
	private PurchaseItemDao purchaseItemDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesPurchaseDao salesPurchaseDao;

	@Override
	public void pagePurchase(Paging paging, List<Filter> filters, int company) {

		List<PurchasePO> purchasePOs = purchaseDao.pagePurchase(paging, filters, company);

		List<PurchaseVO> purchaseVOs = purchasePage(purchasePOs);

		paging.setData(purchaseVOs);

	}

	@Override
	public void pagePurchaseObDelivery(Paging paging, List<Filter> filters, int company) {

		List<PurchasePO> purchasePOs = purchaseDao.pagePurchaseObDelivery(paging, filters, company);

		List<PurchaseVO> purchaseVOs = purchasePage(purchasePOs);

		paging.setData(purchaseVOs);

	}

	public List<PurchaseVO> purchasePage(List<PurchasePO> purchasePOs) {

		List<PurchaseVO> purchaseVOs = new ArrayList<PurchaseVO>();

		PurchaseVO purchaseVO = null;

		for (PurchasePO purchasePO : purchasePOs) {

			purchaseVO = new PurchaseVO(new UserBaseVO());

			BeanUtil.copyProperties(purchasePO, purchaseVO, Arrays.asList("user"));
			purchaseVO.getUser().setBaseInfo(purchasePO.getUser());
			purchaseVOs.add(purchaseVO);

		}

		return purchaseVOs;
	}

	@Override
	public PurchaseVO queryPurchaseByPid(PurchaseVO purchaseVO) {

		PurchasePO purchasePO = purchaseDao.queryPurchaseByPid(purchaseVO.getPid());

		purchaseVO = new PurchaseVO();

		BeanUtil.copyProperties(purchasePO, purchaseVO, Arrays.asList("user"));

		return purchaseVO;

	}

	@Override
	public List<PurchaseVO> queryPurchaseBySid(SalesVO salesVO) {

		List<SalesPurchasePO> salesPurchasePOs = salesPurchaseDao.querySalesPurchaseBySid(salesVO.getSid());

		List<PurchaseVO> purchaseVOs = new ArrayList<PurchaseVO>();

		for (SalesPurchasePO salesPurchasePO : salesPurchasePOs) {

			PurchaseVO purchaseVO = new PurchaseVO(new UserBaseVO());

			BeanUtil.copyProperties(salesPurchasePO.getPurchase(), purchaseVO, Arrays.asList("user"));
			BeanUtil.copyProperties(salesPurchasePO.getPurchase().getUser(), purchaseVO.getUser(), Arrays.asList("duty", "dept"));

			purchaseVOs.add(purchaseVO);
		}

		return purchaseVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPurchase(PurchaseVO purchaseVO, List<Long> sids, List<PurchaseItemVO> purchaseItemVOs, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PO_INT, currentDate, company);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		String purchaseId = companyPO.getShortname() + String.valueOf("PO") + currentDate + endNo;

		PurchasePO purchasePO = new PurchasePO(purchaseId);

		BeanUtil.copyProperties(purchaseVO, purchasePO, Arrays.asList("user"));

		UserPO userPO = userDao.queryUserByUserId(userId);

		purchasePO.setUser(userPO);
		purchasePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		purchasePO.setBalanceTime(new Timestamp(System.currentTimeMillis()));
		purchasePO.setStatus(PurchasePO.STATUS_INIT_INT);
		purchasePO.setBalanceStatus(PurchasePO.BALANCESTATUS_INIT_INT);
		purchasePO.setCompany(company);
		// 插入采购单信息
		purchaseDao.save(purchasePO);

		PurchaseItemPO purchaseItemPO;

		for (PurchaseItemVO purchaseItemVO : purchaseItemVOs) {

			purchaseItemPO = new PurchaseItemPO(new GoodsPO(), new ColorPO(), new FormatPO());

			purchaseItemPO.setPid(purchasePO.getPid());

			BeanUtil.copyProperties(purchaseItemVO, purchaseItemPO, Arrays.asList("goods", "color", "format", "supplier"));
			BeanUtil.copyProperties(purchaseItemVO.getGoods(), purchaseItemPO.getGoods());
			BeanUtil.copyProperties(purchaseItemVO.getColor(), purchaseItemPO.getColor());
			BeanUtil.copyProperties(purchaseItemVO.getFormat(), purchaseItemPO.getFormat());

			purchaseItemPO.setSurplus(purchaseItemVO.getNum());

			purchaseItemDao.save(purchaseItemPO);
		}

		SalesPO salesPO;
		SalesPurchasePO salesPurchasePO;

		if (sids != null && sids.size() != 0) {

			for (Long sid : sids) {

				salesPO = salesDao.get(sid);

				salesPurchasePO = new SalesPurchasePO(salesPO, purchasePO);

				salesPurchaseDao.save(salesPurchasePO);
			}
		}

		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePurchase(PurchaseVO purchaseVO) throws FLException {

		PurchasePO purchasePO = purchaseDao.get(purchaseVO.getPid());

		if (purchasePO == null) {
			throw new FLException(260017, "采购单不存在");
		}

		if (purchasePO.getStatus() == 2) {
			throw new FLException(260018, "采购单状态不可操作");
		}

		purchasePO.setPid(purchaseVO.getPid());
		purchasePO.setComment(purchaseVO.getComment());

		purchaseDao.update(purchasePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePurchaseStatus(PurchaseVO purchaseVO) throws FLException {

		PurchasePO purchasePO = purchaseDao.get(purchaseVO.getPid());

		if (purchasePO == null) {
			throw new FLException(260017, "采购单不存在");
		}

		if (purchasePO.getStatus() == 2) {
			throw new FLException(260018, "采购单状态不可操作");
		}

		purchasePO.setPid(purchaseVO.getPid());
		purchasePO.setStatus(PurchasePO.STATUS_BATCHIN_PART_INT);

		purchaseDao.update(purchasePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePurchaseForStatus(PurchaseVO purchaseVO) throws FLException {

		PurchasePO purchasePO = purchaseDao.get(purchaseVO.getPid());

		if (purchasePO == null) {
			throw new FLException(260017, "采购单不存在");
		}

		if (purchasePO.getStatus() == 2) {
			throw new FLException(260018, "采购单状态不可操作");
		}

		purchasePO.setPid(purchaseVO.getPid());
		purchasePO.setStatus(PurchasePO.STATUS_BATCHIN_ALL_INT);

		purchaseDao.update(purchasePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePurchaseForBalanceStatus(PurchaseVO purchaseVO) throws FLException {

		PurchasePO purchasePO = purchaseDao.get(purchaseVO.getPid());

		if (purchasePO == null) {
			throw new FLException(260017, "采购单不存在");
		}

		purchasePO.setPid(purchaseVO.getPid());
		purchasePO.setBalanceStatus(PurchasePO.BALANCESTATUS_FINISH_INT);

		return 0;
	}

}
