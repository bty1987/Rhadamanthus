package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.material.vo.AoodsVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.inventory.dao.OccessoriesDao;
import com.fanglin.inventory.dao.OccessoriesItemDao;
import com.fanglin.inventory.po.OccessoriesItemPO;
import com.fanglin.inventory.po.OccessoriesPO;
import com.fanglin.inventory.service.OccessoriesItemService;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.inventory.vo.OccessoriesVO;
import com.fanglin.utils.Arith;

@Service("occessoriesItemService")
@Transactional(readOnly = true)
public class OccessoriesItemServiceImpl implements OccessoriesItemService {

	@Autowired
	private OccessoriesItemDao occessoriesItemDao;

	@Autowired
	private OccessoriesDao occessoriesDao;

	@Autowired
	private GoodsDao goodsDao;

	@Override
	public List<OccessoriesItemVO> queryOccessoriesItemByOid(OccessoriesItemVO occessoriesItemVO) {

		List<OccessoriesItemPO> occessoriesItemPOs = occessoriesItemDao.queryOccessoriesItemByOid(occessoriesItemVO.getOid());
		List<OccessoriesItemVO> occessoriesItemVOs = new ArrayList<OccessoriesItemVO>();

		for (OccessoriesItemPO occessoriesItemPO : occessoriesItemPOs) {
			occessoriesItemVOs.add(occessoriesItemPO.ptv(new OccessoriesItemVO(new GoodsVO(new AccessoriesTypeVO(new WorkTypeVO())), new AoodsVO())));
		}

		return occessoriesItemVOs;
	}

	@Override
	public int amountOccessoriesItem(OccessoriesVO occessoriesVO, OccessoriesItemVO occessoriesItemVO) {

		if (occessoriesVO == null) return 0;
		if (occessoriesItemVO == null) return 0;

		if (occessoriesVO.getDecoration() == null) return 0;

		int amount = occessoriesItemDao.amountOccessoriesItem(occessoriesVO.getDecoration().getOrderId(), occessoriesItemVO.getNid());

		occessoriesVO.setAmount(amount);
		occessoriesItemVO.setAmount(amount);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesItemVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		OccessoriesItemPO occessoriesItemPO = new OccessoriesItemPO().init(occessoriesItemVO.getOid(), occessoriesItemVO.getGoods().getGid(), occessoriesItemVO.getNum());

		occessoriesItemPO.setRbalance(occessoriesItemVO.getRbalance());
		occessoriesItemPO.setVbalance(occessoriesItemVO.getRbalance());

		occessoriesPO.setTotal(Arith.add(occessoriesPO.getTotal(), (occessoriesItemVO.getGoods().getSelling() * occessoriesItemVO.getNum())));

		occessoriesItemDao.save(occessoriesItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException {

		OccessoriesItemPO occessoriesItemPO = occessoriesItemDao.get(occessoriesItemVO.getOiid());

		if (occessoriesItemPO == null) {
			throw new FLException(260080, "辅料单不存在");
		}

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesItemPO.getOid());

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}
		GoodsPO goodsPO = goodsDao.get(occessoriesItemVO.getGoods().getGid());

		long oldTotal = occessoriesPO.getTotal();
		long totals = Arith.mul(occessoriesItemPO.getNum(), goodsPO.getSelling());
		long total = Arith.mul(occessoriesItemVO.getNum(), goodsPO.getSelling());

		occessoriesPO.setTotal(Arith.sub(oldTotal, (Arith.sub(totals, total))));
		occessoriesItemPO.setNum(occessoriesItemVO.getNum());

		occessoriesItemDao.update(occessoriesItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException {

		OccessoriesItemPO occessoriesItemPO = occessoriesItemDao.get(occessoriesItemVO.getOiid());

		if (occessoriesItemPO == null) {
			throw new FLException(260081, "辅料项不存在");
		}

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesItemPO.getOid());

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		long total = Arith.mul(occessoriesItemPO.getGoods().getSelling(), occessoriesItemPO.getNum());

		occessoriesPO.setTotal(Arith.sub(occessoriesPO.getTotal(), total));

		occessoriesItemDao.delete(occessoriesItemPO);

		return 0;
	}

}
