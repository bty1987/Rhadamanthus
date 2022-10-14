package com.fanglin.inventory.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.construction.dao.AcceptanceDao;
import com.fanglin.construction.dao.ConstructionAccessoryDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.ConstructionAccessoryPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.inventory.dao.AccessoriesDao;
import com.fanglin.inventory.dao.AccessoriesItemDao;
import com.fanglin.inventory.po.AccessoriesItemPO;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.service.AccessoriesService;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("accessoriesService")
@Transactional(readOnly = true)
public class AccessoriesServiceImpl implements AccessoriesService {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private AccessoriesDao accessoriesDao;

	@Autowired
	private AccessoriesItemDao accessoriesItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionAccessoryDao constructionAccessoryDao;

	@Autowired
	private AcceptanceDao acceptanceDao;

	@Override
	public void pageAccessories(Paging paging, List<Filter> filters, int company) {

		List<AccessoriesPO> accessoriesPOs = accessoriesDao.pageAccessories(paging, filters, company);
		List<AccessoriesVO> accessoriesVOs = new ArrayList<AccessoriesVO>();

		AccessoriesVO accessoriesVO;

		for (AccessoriesPO accessoriesPO : accessoriesPOs) {

			accessoriesVO = new AccessoriesVO(new HouseVO(new VillageVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(accessoriesPO, accessoriesVO, Arrays.asList("house", "creater", "approver", "supervisor", "deliver"));
			BeanUtil.copyProperties(accessoriesPO.getHouse(), accessoriesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyPropertie(accessoriesPO.getHouse().getVillage(), accessoriesVO.getHouse().getVillage(), Arrays.asList("cityProper", "buildingNameRule"));

			accessoriesVO.getCreater().setBaseInfo(accessoriesPO.getCreater());
			accessoriesVO.getApprover().setBaseInfo(accessoriesPO.getApprover());
			accessoriesVO.getSupervisor().setBaseInfo(accessoriesPO.getSupervisor());

			accessoriesVOs.add(accessoriesVO);
		}

		paging.setData(accessoriesVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAccessories(AccessoriesVO accessoriesVO, List<AccessoriesItemVO> accessoriesItemVOs, String userId) throws FLException {

		String orderId = accessoriesVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		List<Short> status = Arrays.asList(DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_FINAL_INT, DecorationPO.STATUS_COMPLETED_INT);

		if (status.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		int company = decorationPO.getCompany();

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionSchedule(orderId, accessoriesVO.getCnid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		AcceptancePO acceptancePO = acceptanceDao.queryAcceptanceByOrderId(orderId);

		if (acceptancePO != null) {
			throw new FLException(120034, "工程已验收");
		}

		if (constructionSchedulePO.getStatus() == ConstructionSchedulePO.STATUS_INIT_INT) {
			throw new FLException(120025, "工程环节不可操作");
		}

		if (constructionPO.getAccessory() != ConstructionPO.ACCESSORY_OPEN_SHORT) {
			throw new FLException(120028, "辅料已禁用");
		}

		if (Arith.add(constructionPO.getAccessoryTotal(), accessoriesVO.getTotal()) > constructionPO.getAccessoryLimit()) {
			throw new FLException(260058, "辅料总额已达上限");
		}

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AO_INT, currentDate, company);
		String no = String.format("%sAO%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));

		Timestamp fetchTime = accessoriesVO.getFetchTime();

		String comment = accessoriesVO.getComment();

		UserPO createrPO = userDao.queryUserByUserId(userId);

		AccessoriesPO accessoriesPO = new AccessoriesPO().init(no, orderId, constructionSchedulePO.getCsid(), constructionSchedulePO.getCnid(), decorationPO.getHouse(), createrPO, fetchTime, constructionSchedulePO.getSchedule(), comment, company);

		if (accessoriesVO.getSupervisor() != null) {
			accessoriesPO.setSupervisor(userDao.queryUserByUserId(accessoriesVO.getSupervisor().getUserId()));
		}

		constructionPO.setAccessoryTotal(Arith.add(constructionPO.getAccessoryTotal(), accessoriesVO.getTotal()));

		constructionDao.update(constructionPO);

		accessoriesDao.save(accessoriesPO);

		for (AccessoriesItemVO accessoriesItemVO : accessoriesItemVOs) {

			ConstructionAccessoryPO constructionAccessoryPO = constructionAccessoryDao.queryConstructionAccessory(constructionPO.getCid(), accessoriesItemVO.getGoods().getGid());

			if (constructionAccessoryPO != null) {
				if (constructionAccessoryPO.getCheckup() == ConstructionAccessoryPO.CHECKUP_VERIFY_SHORT) {
					if (Arith.add(constructionAccessoryPO.getNum(), accessoriesItemVO.getNum()) > constructionAccessoryPO.getNumLimit()) {
						throw new FLException(260059, "辅料总数已达上限");
					}
				}

				constructionAccessoryPO.setTotal(Arith.add(constructionAccessoryPO.getTotal(), accessoriesItemVO.getTotal()));
				constructionAccessoryPO.setNum(Arith.add(constructionAccessoryPO.getNum(), accessoriesItemVO.getNum()));
				constructionAccessoryDao.update(constructionAccessoryPO);
			}

			accessoriesItemDao.save(new AccessoriesItemPO().init(accessoriesPO.getAid(), accessoriesItemVO.getGoods().getGid(), accessoriesItemVO.getSelling(), accessoriesItemVO.getNum()));
		}

		return 0;
	}

	// 预出状态
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int preoutAccessories(AccessoriesVO accessoriesVO, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

		if (accessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (accessoriesPO.getStatus() != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		accessoriesPO.setStatus(AccessoriesPO.STATUS_ADVANCE_INT);
		accessoriesPO.setApprover(userPO);
		accessoriesPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));

		accessoriesDao.update(accessoriesPO);

		return 0;
	}

	// 撤销状态
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelAccessories(AccessoriesVO accessoriesVO, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

		if (accessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (accessoriesPO.getStatus() != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(accessoriesPO.getOrderId());

		List<AccessoriesItemPO> accessoriesItemPOs = accessoriesItemDao.queryAccessoriesItemByAid(accessoriesVO.getAid());

		long total = 0;

		for (AccessoriesItemPO accessoriesItemPO : accessoriesItemPOs) {

			ConstructionAccessoryPO constructionAccessoryPO = constructionAccessoryDao.queryConstructionAccessory(constructionPO.getCid(), accessoriesItemPO.getGoods().getGid());

			if (constructionAccessoryPO != null) {
				constructionAccessoryPO.setTotal(Arith.sub(constructionAccessoryPO.getTotal(), Arith.mul(accessoriesItemPO.getNum(), accessoriesItemPO.getSelling())));
				constructionAccessoryPO.setNum(Arith.sub(constructionAccessoryPO.getNum(), accessoriesItemPO.getNum()));

				constructionAccessoryDao.update(constructionAccessoryPO);
			}
			total += Arith.mul(accessoriesItemPO.getNum(), accessoriesItemPO.getSelling());
		}

		constructionPO.setAccessoryTotal(Arith.sub(constructionPO.getAccessoryTotal(), total));

		constructionDao.update(constructionPO);

		accessoriesPO.setStatus(AccessoriesPO.STATUS_REJECT_INT);
		accessoriesPO.setApprover(userPO);
		accessoriesPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));

		accessoriesDao.update(accessoriesPO);

		return 0;
	}

	// 拒绝状态
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseAccessories(AccessoriesVO accessoriesVO, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

		if (accessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (accessoriesPO.getStatus() != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(accessoriesPO.getOrderId());

		List<AccessoriesItemPO> accessoriesItemPOs = accessoriesItemDao.queryAccessoriesItemByAid(accessoriesVO.getAid());

		long total = 0;

		for (AccessoriesItemPO accessoriesItemPO : accessoriesItemPOs) {

			ConstructionAccessoryPO constructionAccessoryPO = constructionAccessoryDao.queryConstructionAccessory(constructionPO.getCid(), accessoriesItemPO.getGoods().getGid());

			if (constructionAccessoryPO != null) {
				constructionAccessoryPO.setTotal(Arith.sub(constructionAccessoryPO.getTotal(), Arith.mul(accessoriesItemPO.getNum(), accessoriesItemPO.getSelling())));
				constructionAccessoryPO.setNum(Arith.sub(constructionAccessoryPO.getNum(), accessoriesItemPO.getNum()));

				constructionAccessoryDao.update(constructionAccessoryPO);
			}
			total += Arith.mul(accessoriesItemPO.getNum(), accessoriesItemPO.getSelling());
		}

		constructionPO.setAccessoryTotal(Arith.sub(constructionPO.getAccessoryTotal(), total));

		constructionDao.update(constructionPO);

		accessoriesPO.setStatus(AccessoriesPO.STATUS_UNDO_INT);
		accessoriesPO.setApprover(userPO);
		accessoriesPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));

		accessoriesDao.update(accessoriesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAccessoriesForPrint(AccessoriesVO accessoriesVO) throws FLException {

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

		if (accessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		int num = Arith.add(accessoriesPO.getPrintnum(), 1);

		accessoriesPO.setPrintnum(num);

		accessoriesDao.update(accessoriesPO);

		accessoriesVO.setPrintnum(accessoriesPO.getPrintnum());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deliveAccessories(AccessoriesVO accessoriesVO, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

		if (accessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (accessoriesPO.getStatus() != AccessoriesPO.STATUS_BATCHOUT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		accessoriesPO.setStatus(AccessoriesPO.STATUS_DELIVER_INT);
		accessoriesPO.setDeliver(userPO);
		accessoriesPO.setDeliverTime(DateUtil.getDateToTimestamp(new Date()));

		accessoriesDao.update(accessoriesPO);

		return 0;
	}

	@Override
	public List<AccessoriesVO> queryAccessoriesByOrderId(AccessoriesVO accessoriesVO) {

		List<AccessoriesPO> accessoriesPOs = accessoriesDao.queryAccessoriesByOrderId(accessoriesVO.getOrderId());
		List<AccessoriesVO> accessoriesVOs = new ArrayList<AccessoriesVO>();

		for (AccessoriesPO accessoriesPO : accessoriesPOs) {

			accessoriesVO = new AccessoriesVO(new HouseVO(new VillageVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());
			BeanUtil.copyProperties(accessoriesPO, accessoriesVO, Arrays.asList("house", "creater", "approver", "supervisor", "deliver"));
			BeanUtil.copyProperties(accessoriesPO.getHouse(), accessoriesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyPropertie(accessoriesPO.getHouse().getVillage(), accessoriesVO.getHouse().getVillage(), Arrays.asList("cityProper", "buildingNameRule"));

			accessoriesVO.getCreater().setBaseInfo(accessoriesPO.getCreater());
			accessoriesVO.getApprover().setBaseInfo(accessoriesPO.getApprover());
			accessoriesVO.getSupervisor().setBaseInfo(accessoriesPO.getSupervisor());

			accessoriesVOs.add(accessoriesVO);
		}

		return accessoriesVOs;
	}

}
