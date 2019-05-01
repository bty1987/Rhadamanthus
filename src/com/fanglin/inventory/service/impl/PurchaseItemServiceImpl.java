package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.PurchaseDao;
import com.fanglin.inventory.dao.PurchaseItemDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.PurchaseItemPO;
import com.fanglin.inventory.po.PurchasePO;
import com.fanglin.inventory.service.PurchaseItemService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.utils.BeanUtil;

@Service("purchaseItemService")
@Transactional(readOnly = true)
public class PurchaseItemServiceImpl implements PurchaseItemService {

	@Autowired
	private PurchaseDao purchaseDao;

	@Autowired
	private PurchaseItemDao purchaseItemDao;

	@Override
	public List<PurchaseItemVO> queryPurchaseItemByPids(List<Long> pids) {

		List<PurchaseItemPO> purchaseItemPOs = purchaseItemDao.queryPurchaseItemByPids(pids);
		List<PurchaseItemVO> purchaseItemVOs = new ArrayList<PurchaseItemVO>();

		PurchaseItemVO purchaseItemVO;

		for (PurchaseItemPO purchaseItemPO : purchaseItemPOs) {

			purchaseItemVO = new PurchaseItemVO(new GoodsVO(), new ColorVO(), new FormatVO());

			BeanUtil.copyProperties(purchaseItemPO, purchaseItemVO, Arrays.asList("goods", "color", "format", "supplier"));
			BeanUtil.copyProperties(purchaseItemPO.getGoods(), purchaseItemVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(purchaseItemPO.getColor(), purchaseItemVO.getColor());
			BeanUtil.copyProperties(purchaseItemPO.getFormat(), purchaseItemVO.getFormat());

			purchaseItemVOs.add(purchaseItemVO);
		}

		return purchaseItemVOs;
	}

	@Override
	public List<PurchaseItemVO> queryPurchaseItemByPid(PurchaseVO purchaseVO) {

		List<PurchaseItemPO> purchaseItemPOs = purchaseItemDao.queryPurchaseItemByPid(purchaseVO.getPid());
		List<PurchaseItemVO> purchaseItemVOs = new ArrayList<PurchaseItemVO>();

		PurchaseItemVO purchaseItemVO;

		for (PurchaseItemPO purchaseItemPO : purchaseItemPOs) {

			purchaseItemVO = new PurchaseItemVO(new GoodsVO(), new ColorVO(), new FormatVO());

			BeanUtil.copyProperties(purchaseItemPO, purchaseItemVO, Arrays.asList("goods", "color", "format", "supplier"));
			BeanUtil.copyProperties(purchaseItemPO.getGoods(), purchaseItemVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(purchaseItemPO.getColor(), purchaseItemVO.getColor());
			BeanUtil.copyProperties(purchaseItemPO.getFormat(), purchaseItemVO.getFormat());

			purchaseItemVOs.add(purchaseItemVO);

		}

		return purchaseItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPurchaseItem(PurchaseVO purchaseVO, PurchaseItemVO purchaseItemVO) throws FLException {

		PurchasePO purchasePO = purchaseDao.get(purchaseVO.getPid());

		if (purchasePO == null) {
			throw new FLException(260017, "采购单不存在");
		}

		if (purchasePO.getStatus() != PurchasePO.STATUS_INIT_INT) {
			throw new FLException(260018, "采购单状态不可操作");
		}

		PurchaseItemPO purchaseItemPO = new PurchaseItemPO();

		purchaseItemPO.setPid(purchasePO.getPid());

		purchaseItemPO.setGoods(new GoodsPO(purchaseItemVO.getGoods().getGid()));
		purchaseItemPO.setColor(new ColorPO(purchaseItemVO.getColor().getCid()));
		purchaseItemPO.setFormat(new FormatPO(purchaseItemVO.getFormat().getFid()));

		purchaseItemPO.setUnitPrice(purchaseItemVO.getUnitPrice());
		purchaseItemPO.setNum(purchaseItemVO.getNum());
		purchaseItemPO.setSurplus(purchaseItemVO.getNum());

		purchaseItemDao.save(purchaseItemPO);

		purchaseItemVO.setPiid(purchaseItemPO.getPiid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePurchaseItem(PurchaseVO purchaseVO, PurchaseItemVO purchaseItemVO) throws FLException {

		PurchasePO purchasePO = purchaseDao.get(purchaseVO.getPid());

		if (purchasePO == null) {
			throw new FLException(260017, "采购单不存在");
		}

		if (purchasePO.getStatus() != PurchasePO.STATUS_INIT_INT) {
			throw new FLException(260018, "采购单状态不可操作");
		}

		PurchaseItemPO purchaseItemPO = purchaseItemDao.get(purchaseItemVO.getPiid());

		purchaseItemPO.setUnitPrice(purchaseItemVO.getUnitPrice());
		purchaseItemPO.setNum(purchaseItemVO.getNum());
		purchaseItemPO.setSurplus(purchaseItemVO.getNum());

		purchaseItemDao.update(purchaseItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deletePurchaseItem(PurchaseVO purchaseVO, PurchaseItemVO purchaseItemVOs) throws FLException {

		PurchasePO purchasePO = purchaseDao.get(purchaseVO.getPid());

		if (purchasePO == null) {
			throw new FLException(260017, "采购单不存在");
		}

		if (purchasePO.getStatus() != PurchasePO.STATUS_INIT_INT) {
			throw new FLException(260018, "采购单状态不可操作");
		}

		PurchaseItemPO purchaseItemPOs = purchaseItemDao.get(purchaseItemVOs.getPiid());

		if (purchaseItemPOs == null) {
			throw new FLException(260019, "采购项不存在");
		}

		purchaseItemDao.delete(purchaseItemPOs);

		return 0;
	}

}
