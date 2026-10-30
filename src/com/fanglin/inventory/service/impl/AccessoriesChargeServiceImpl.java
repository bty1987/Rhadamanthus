package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.AccessoriesChargeDao;
import com.fanglin.inventory.dao.AccessoriesDao;
import com.fanglin.inventory.dao.AccessoriesItemDao;
import com.fanglin.inventory.po.AccessoriesChargePO;
import com.fanglin.inventory.po.AccessoriesItemPO;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.service.AccessoriesChargeService;
import com.fanglin.inventory.service.AccessoriesItemService;
import com.fanglin.inventory.vo.AccessoriesChargeVO;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.utils.BeanUtil;

@Service("accessoriesChargeService")
@Transactional(readOnly = true)
public class AccessoriesChargeServiceImpl implements AccessoriesChargeService {

	@Autowired
	private AccessoriesChargeDao accessoriesChargeDao;

	@Autowired
	private AccessoriesDao accessoriesDao;

	@Autowired
	private AccessoriesItemDao accessoriesItemDao;

	@Autowired
	private AccessoriesItemService accessoriesItemService;

	@Override
	public List<AccessoriesChargeVO> queryAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO) {

		List<AccessoriesChargePO> accessoriesChargePOs = null;

		// 根据 aiid 查询（优先）
		if (accessoriesChargeVO != null && accessoriesChargeVO.getAccessoriesItem() != null
				&& accessoriesChargeVO.getAccessoriesItem().getAiid() != null) {
			accessoriesChargePOs = accessoriesChargeDao.queryAccessoriesChargeByIid(
					accessoriesChargeVO.getAccessoriesItem().getAiid());
		}
		// 根据 aid 查询
		else if (accessoriesChargeVO != null && accessoriesChargeVO.getAccessories() != null
				&& accessoriesChargeVO.getAccessories().getAid() != null) {
			accessoriesChargePOs = accessoriesChargeDao.queryAccessoriesChargeByAid(
					accessoriesChargeVO.getAccessories().getAid());
		}

		List<AccessoriesChargeVO> accessoriesChargeVOs = new ArrayList<AccessoriesChargeVO>();

		if (accessoriesChargePOs != null) {
			for (AccessoriesChargePO accessoriesChargePO : accessoriesChargePOs) {
				AccessoriesChargeVO vo = new AccessoriesChargeVO(new AccessoriesVO(), new AccessoriesItemVO());
				accessoriesChargePO.ptv(vo);
				accessoriesChargeVOs.add(vo);
			}
		}

		return accessoriesChargeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO) throws FLException {

		// 验证辅料单或辅料项存在
		if (accessoriesChargeVO.getAccessories() != null && accessoriesChargeVO.getAccessories().getAid() != null) {
			AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesChargeVO.getAccessories().getAid());
			if (accessoriesPO == null) {
				throw new FLException(260023, "辅料单不存在");
			}
			checkAccessoriesEditable(accessoriesPO);
		}

		if (accessoriesChargeVO.getAccessoriesItem() != null && accessoriesChargeVO.getAccessoriesItem().getAiid() != null) {
			AccessoriesItemPO accessoriesItemPO = accessoriesItemDao.get(accessoriesChargeVO.getAccessoriesItem().getAiid());
			if (accessoriesItemPO == null) {
				throw new FLException(260025, "辅料项不存在");
			}
		}

		AccessoriesChargePO accessoriesChargePO = new AccessoriesChargePO();
		BeanUtil.copyProperties(accessoriesChargeVO, accessoriesChargePO, "accessories", "accessoriesItem");

		if (accessoriesChargeVO.getAccessories() != null) {
			accessoriesChargePO.setAccessories(new AccessoriesPO(accessoriesChargeVO.getAccessories().getAid()));
		}

		if (accessoriesChargeVO.getAccessoriesItem() != null) {
			AccessoriesItemPO itemPO = new AccessoriesItemPO();
			itemPO.setAiid(accessoriesChargeVO.getAccessoriesItem().getAiid());
			accessoriesChargePO.setAccessoriesItem(itemPO);
		}

		accessoriesChargeDao.save(accessoriesChargePO);

		refreshAccessoriesCharge(accessoriesChargePO.getAccessories().getAid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO) throws FLException {

		if (accessoriesChargeVO.getAcid() == null) {
			throw new FLException(260070, "费用ID不能为空");
		}

		AccessoriesChargePO accessoriesChargePO = accessoriesChargeDao.get(accessoriesChargeVO.getAcid());

		if (accessoriesChargePO == null) {
			throw new FLException(260095, "辅料费用不存在");
		}

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesChargePO.getAccessories().getAid());

		if (accessoriesPO != null) {
			checkAccessoriesEditable(accessoriesPO);
		}

		BeanUtil.copyProperties(accessoriesChargeVO, accessoriesChargePO, "accessories", "accessoriesItem");

		accessoriesChargeDao.update(accessoriesChargePO);

		refreshAccessoriesCharge(accessoriesChargePO.getAccessories().getAid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO) throws FLException {

		if (accessoriesChargeVO.getAcid() == null) {
			throw new FLException(260070, "费用ID不能为空");
		}

		AccessoriesChargePO accessoriesChargePO = accessoriesChargeDao.get(accessoriesChargeVO.getAcid());

		if (accessoriesChargePO != null) {

			AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesChargePO.getAccessories().getAid());

			if (accessoriesPO != null) {
				checkAccessoriesEditable(accessoriesPO);
			}

			accessoriesChargeDao.delete(accessoriesChargePO);

			refreshAccessoriesCharge(accessoriesChargePO.getAccessories().getAid());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int batchAccessoriesCharge(AccessoriesChargeVO accessoriesChargeVO, List<AccessoriesChargeVO> accessoriesCharges) throws FLException {

		// 获取辅料单ID
		if (accessoriesChargeVO == null || accessoriesChargeVO.getAccessories() == null
				|| accessoriesChargeVO.getAccessories().getAid() == null) {
			throw new FLException(260096, "辅料单ID不能为空");
		}

		Long aid = accessoriesChargeVO.getAccessories().getAid();

		// 验证辅料单存在
		AccessoriesPO accessoriesPO = accessoriesDao.get(aid);
		if (accessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		checkAccessoriesEditable(accessoriesPO);

		// 删除该辅料单的所有旧费用
		List<AccessoriesChargePO> oldCharges = accessoriesChargeDao.queryAccessoriesChargeByAid(aid);
		if (oldCharges != null && !oldCharges.isEmpty()) {
			for (AccessoriesChargePO oldCharge : oldCharges) {
				accessoriesChargeDao.delete(oldCharge);
			}
		}

		// 批量插入新费用
		if (accessoriesCharges != null && !accessoriesCharges.isEmpty()) {
			for (AccessoriesChargeVO vo : accessoriesCharges) {
				AccessoriesChargePO po = new AccessoriesChargePO();
				BeanUtil.copyProperties(vo, po, "accessories", "accessoriesItem");
				po.setAccessories(new AccessoriesPO(aid));

				// 如果有辅料项，也需要设置
				if (vo.getAccessoriesItem() != null && vo.getAccessoriesItem().getAiid() != null) {
					AccessoriesItemPO itemPO = new AccessoriesItemPO();
					itemPO.setAiid(vo.getAccessoriesItem().getAiid());
					po.setAccessoriesItem(itemPO);
				}

				accessoriesChargeDao.save(po);
			}
		}

		refreshAccessoriesCharge(aid);

		return 0;
	}

	// 结算后的辅料单不允许再动费用明细，防止已结算金额与费用明细脱钩（补外辅的费用脱钩缺口）
	private void checkAccessoriesEditable(AccessoriesPO accessoriesPO) throws FLException {

		if (accessoriesPO.getStatus() >= AccessoriesPO.STATUS_DELIVER_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}
	}

	// 费用行写操作后回写主单charge（行Σ优先, 无行回退模板现算）
	private void refreshAccessoriesCharge(long aid) throws FLException {

		AccessoriesPO accessoriesPO = accessoriesDao.get(aid);

		if (accessoriesPO == null) return;

		accessoriesPO.setCharge(accessoriesItemService.refreshAccessoriesCharge(accessoriesPO));

		accessoriesDao.update(accessoriesPO);
	}

}
