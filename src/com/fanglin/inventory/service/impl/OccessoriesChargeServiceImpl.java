package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.OccessoriesChargeDao;
import com.fanglin.inventory.dao.OccessoriesDao;
import com.fanglin.inventory.dao.OccessoriesItemDao;
import com.fanglin.inventory.po.OccessoriesChargePO;
import com.fanglin.inventory.po.OccessoriesItemPO;
import com.fanglin.inventory.po.OccessoriesPO;
import com.fanglin.inventory.service.OccessoriesChargeService;
import com.fanglin.inventory.vo.OccessoriesChargeVO;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.inventory.vo.OccessoriesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("occessoriesChargeService")
@Transactional(readOnly = true)
public class OccessoriesChargeServiceImpl implements OccessoriesChargeService {

	@Autowired
	private OccessoriesChargeDao occessoriesChargeDao;

	@Autowired
	private OccessoriesDao occessoriesDao;

	@Autowired
	private OccessoriesItemDao occessoriesItemDao;

	@Override
	public List<OccessoriesChargeVO> queryOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO) {

		List<OccessoriesChargePO> occessoriesChargePOs = null;

		// 根据 oiid 查询（优先）
		if (occessoriesChargeVO != null && occessoriesChargeVO.getOccessoriesItem() != null
				&& occessoriesChargeVO.getOccessoriesItem().getOiid() != null) {
			occessoriesChargePOs = occessoriesChargeDao.queryOccessoriesChargeByOiid(
					occessoriesChargeVO.getOccessoriesItem().getOiid());
		}
		// 根据 oid 查询
		else if (occessoriesChargeVO != null && occessoriesChargeVO.getOccessories() != null
				&& occessoriesChargeVO.getOccessories().getOid() != null) {
			occessoriesChargePOs = occessoriesChargeDao.queryOccessoriesChargeByOid(
					occessoriesChargeVO.getOccessories().getOid());
		}

		List<OccessoriesChargeVO> occessoriesChargeVOs = new ArrayList<OccessoriesChargeVO>();

		if (occessoriesChargePOs != null) {
			for (OccessoriesChargePO occessoriesChargePO : occessoriesChargePOs) {
				// 使用 ptv 方法转换，需要先声明关联对象
				OccessoriesChargeVO vo = new OccessoriesChargeVO(
					new OccessoriesVO(),
					new OccessoriesItemVO()
				);
				occessoriesChargePO.ptv(vo);
				occessoriesChargeVOs.add(vo);
			}
		}

		return occessoriesChargeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO) throws FLException {

		// 验证外辅单或外辅项存在
		if (occessoriesChargeVO.getOccessories() != null && occessoriesChargeVO.getOccessories().getOid() != null) {
			OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesChargeVO.getOccessories().getOid());
			if (occessoriesPO == null) {
				throw new FLException(260023, "外辅单不存在");
			}
		}

		if (occessoriesChargeVO.getOccessoriesItem() != null && occessoriesChargeVO.getOccessoriesItem().getOiid() != null) {
			OccessoriesItemPO occessoriesItemPO = occessoriesItemDao.get(occessoriesChargeVO.getOccessoriesItem().getOiid());
			if (occessoriesItemPO == null) {
				throw new FLException(260024, "外辅项不存在");
			}
		}

		OccessoriesChargePO occessoriesChargePO = new OccessoriesChargePO();
		BeanUtil.copyProperties(occessoriesChargeVO, occessoriesChargePO, "occessories", "occessoriesItem");

		if (occessoriesChargeVO.getOccessories() != null) {
			occessoriesChargePO.setOccessories(new OccessoriesPO(occessoriesChargeVO.getOccessories().getOid()));
		}

		if (occessoriesChargeVO.getOccessoriesItem() != null) {
			OccessoriesItemPO itemPO = new OccessoriesItemPO();
			itemPO.setOiid(occessoriesChargeVO.getOccessoriesItem().getOiid());
			occessoriesChargePO.setOccessoriesItem(itemPO);
		}

		occessoriesChargeDao.save(occessoriesChargePO);

		// 重新计算外辅单 charge/rcharge
		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesChargeVO.getOccessories().getOid());
		if (occessoriesPO != null) {
			recalcCharge(occessoriesPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO) throws FLException {

		if (occessoriesChargeVO.getAcid() == null) {
			throw new FLException(260070, "费用ID不能为空");
		}

		OccessoriesChargePO occessoriesChargePO = occessoriesChargeDao.get(occessoriesChargeVO.getAcid());

		if (occessoriesChargePO == null) {
			throw new FLException(260071, "外辅费用不存在");
		}

		BeanUtil.copyProperties(occessoriesChargeVO, occessoriesChargePO, "occessories", "occessoriesItem");

		occessoriesChargeDao.update(occessoriesChargePO);

		// 重新计算外辅单 charge/rcharge
		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesChargePO.getOccessories().getOid());
		if (occessoriesPO != null) {
			recalcCharge(occessoriesPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO) throws FLException {

		if (occessoriesChargeVO.getAcid() == null) {
			throw new FLException(260070, "费用ID不能为空");
		}

		OccessoriesChargePO occessoriesChargePO = occessoriesChargeDao.get(occessoriesChargeVO.getAcid());

		if (occessoriesChargePO != null) {
			occessoriesChargeDao.delete(occessoriesChargePO);

			// 重新计算外辅单 charge/rcharge
			OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesChargePO.getOccessories().getOid());
			if (occessoriesPO != null) {
				recalcCharge(occessoriesPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int batchOccessoriesCharge(OccessoriesChargeVO occessoriesChargeVO, List<OccessoriesChargeVO> occessoriesCharges) throws FLException {

		// 获取外辅单ID
		if (occessoriesChargeVO == null || occessoriesChargeVO.getOccessories() == null
				|| occessoriesChargeVO.getOccessories().getOid() == null) {
			throw new FLException(260070, "外辅单ID不能为空");
		}

		Long oid = occessoriesChargeVO.getOccessories().getOid();

		// 验证外辅单存在
		OccessoriesPO occessoriesPO = occessoriesDao.get(oid);
		if (occessoriesPO == null) {
			throw new FLException(260023, "外辅单不存在");
		}

		// 删除该外辅单的所有旧费用
		List<OccessoriesChargePO> oldCharges = occessoriesChargeDao.queryOccessoriesChargeByOid(oid);
		if (oldCharges != null && !oldCharges.isEmpty()) {
			for (OccessoriesChargePO oldCharge : oldCharges) {
				occessoriesChargeDao.delete(oldCharge);
			}
		}

		// 批量插入新费用
		if (occessoriesCharges != null && !occessoriesCharges.isEmpty()) {
			for (OccessoriesChargeVO vo : occessoriesCharges) {
				OccessoriesChargePO po = new OccessoriesChargePO();
				BeanUtil.copyProperties(vo, po, "occessories", "occessoriesItem");
				po.setOccessories(new OccessoriesPO(oid));

				// 如果有外辅项，也需要设置
				if (vo.getOccessoriesItem() != null && vo.getOccessoriesItem().getOiid() != null) {
					OccessoriesItemPO itemPO = new OccessoriesItemPO();
					itemPO.setOiid(vo.getOccessoriesItem().getOiid());
					po.setOccessoriesItem(itemPO);
				}

				occessoriesChargeDao.save(po);
			}
		}

		// 重新计算外辅单 charge/rcharge
		recalcCharge(occessoriesPO);

		return 0;
	}

	/**
	 * 重新计算外辅单的 charge(费用总额) 并同步更新 rcharge(结算费用)。
	 * 遍历所有 ChargePO，按 isExceed 判断 surplus 是否参与运算，汇总后更新外辅单。
	 */
	private void recalcCharge(OccessoriesPO occessoriesPO) {

		long oid = occessoriesPO.getOid();

		List<OccessoriesChargePO> allCharges = occessoriesChargeDao.queryOccessoriesChargeByOid(oid);

		long totalCharge = 0;
		if (allCharges != null) {
			for (OccessoriesChargePO chargePO : allCharges) {
				int price = chargePO.getPrice();
				int surplus = chargePO.getSurplus();
				int num = chargePO.getNum();

				long chargeAmount;
				if (occessoriesPO.getIsExceed() == OccessoriesPO.ISEXCEED_EXCEED_INT) {
					chargeAmount = Arith.mul(Arith.add(price, surplus), num);
				} else {
					chargeAmount = Arith.mul(price, num);
				}

				totalCharge = Arith.add(totalCharge, chargeAmount);
			}
		}

		occessoriesPO.setCharge(totalCharge);
		occessoriesPO.setRcharge(totalCharge);

		occessoriesDao.update(occessoriesPO);
	}

}
