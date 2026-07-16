package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.production.dao.HardwareDao;
import com.fanglin.production.dao.OutsourceDao;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.dao.ProductionPlanDao;
import com.fanglin.production.dao.TranpackDao;
import com.fanglin.production.po.HardwarePO;
import com.fanglin.production.po.OutsourcePO;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.production.po.TranpackPO;
import com.fanglin.production.service.TranpackService;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.production.vo.TranpackVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("tranpackService")
@Transactional(readOnly = true)
public class TranpackServiceImpl implements TranpackService {

	@Autowired
	private TranpackDao tranpackDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private OutsourceDao outsourceDao;

	@Autowired
	private ProductionDao productionDao;

	@Autowired
	private HardwareDao hardwareDao;

	@Autowired
	private ProductionPlanDao productionPlanDao;

	@Override
	public void pageTranpack(Paging paging, List<Filter> filters) {

		List<TranpackPO> tranpackPOs = tranpackDao.pageTranpack(paging, filters);
		List<TranpackVO> tranpackVOs = new ArrayList<TranpackVO>();

		for (TranpackPO tranpackPO : tranpackPOs) {

			tranpackVOs.add(copyTranpck(tranpackPO));
		}

		paging.setData(tranpackVOs);
	}

	@Override
	public List<TranpackVO> queryTranpackByPid(TranpackVO tranpackVO) {

		List<TranpackPO> tranpackPOs = tranpackDao.queryTranpackByPid(tranpackVO.getProduction().getPid());
		List<TranpackVO> tranpackVOs = new ArrayList<TranpackVO>();

		for (TranpackPO tranpackPO : tranpackPOs) {

			tranpackVOs.add(copyTranpck(tranpackPO));
		}

		return tranpackVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void packTranpackForOutsource(TranpackVO tranpackVO, String userId) throws FLException {

		ProductionPO productionPO = productionDao.get(tranpackVO.getProduction().getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		OutsourcePO outsourcePO = outsourceDao.get(tranpackVO.getRid());

		if (outsourcePO == null) {
			throw new FLException(220006, "外协单不存在");
		}

		Integer count = tranpackDao.countTranpackByRid(tranpackVO.getRid());
		String no = outsourcePO.getNo() + "-" + (count + TranpackPO.COUNT_ONE_INT);

		addTranpack(tranpackVO, userId, productionPO, no);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void packTranpackForHardware(TranpackVO tranpackVO, String userId) throws FLException {

		ProductionPO productionPO = productionDao.get(tranpackVO.getProduction().getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		HardwarePO hardwarePO = hardwareDao.get(tranpackVO.getRid());

		if (hardwarePO == null) {
			throw new FLException(220004, "五金单不存在");
		}

		Integer count = tranpackDao.countTranpackByRid(tranpackVO.getRid());
		String no = hardwarePO.getNo() + "-" + (count + TranpackPO.COUNT_ONE_INT);

		addTranpack(tranpackVO, userId, productionPO, no);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void packTranpackForPlan(TranpackVO tranpackVO, String userId) throws FLException {

		ProductionPO productionPO = productionDao.get(tranpackVO.getProduction().getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		ProductionPlanPO productionPlanPO = productionPlanDao.get(tranpackVO.getRid());

		if (productionPlanPO == null) {
			throw new FLException(220037, "计划不存在");
		}

		Integer count = tranpackDao.countTranpackByRid(tranpackVO.getRid());
		String no = productionPlanPO.getNo() + "-" + (count + TranpackPO.COUNT_ONE_INT);

		addTranpack(tranpackVO, userId, productionPO, no);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int instoreTranpack(TranpackVO tranpackVO) throws FLException {

		TranpackPO tranpackPO = tranpackDao.get(tranpackVO.getTid());

		if (tranpackPO == null) {
			throw new FLException(220023, "物流包不存在");
		}

		if (tranpackPO.getStatus() != TranpackPO.STATUS_INIT_SHORT) {
			throw new FLException(220025, "物流包状态不可操作");
		}

		Integer countOutsource = outsourceDao.countOutsource(tranpackPO.getProduction().getPid(), OutsourcePO.STATUS_END_SHORT);
		Integer countHardware = hardwareDao.countHardware(tranpackPO.getProduction().getPid(), HardwarePO.STATUS_FINISH_SHORT);
		Integer countProductionPlan = productionPlanDao.countProductionPlan(tranpackPO.getProduction().getPid(), ProductionPlanPO.STATUS_FINISH_INT);
		Integer countTranpackByPid = tranpackDao.countTranpackByPid(tranpackPO.getProduction().getPid(), tranpackVO.getStatus(), tranpackPO.getTid());

		if (countTranpackByPid == 0 && countOutsource == 0 && countHardware == 0 && countProductionPlan == 0 && tranpackPO.getProduction().getStatus() == ProductionPO.STATUS_SPLIT_SHORT) {
			tranpackPO.getProduction().setStatus(ProductionPO.STATUS_INSTORE_SHORT);
			tranpackPO.getProduction().setStoreTime(DateUtil.getDateToTimestamp(new Date()));
		}

		tranpackPO.setStatus(tranpackVO.getStatus());
		tranpackPO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		tranpackDao.update(tranpackPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int planTranPack(TranpackVO tranpackVO) throws FLException {

		TranpackPO tranpackPO = tranpackDao.get(tranpackVO.getTid());

		if (tranpackPO == null) {
			throw new FLException(220023, "物流包不存在");
		}

		if (tranpackPO.getStatus() != TranpackPO.STATUS_INSTORE_SHORT) {
			throw new FLException(220025, "物流包状态不可操作");
		}

		Integer countTranpackByPid = tranpackDao.countTranpackByPid(tranpackPO.getProduction().getPid(), tranpackVO.getStatus(), tranpackPO.getTid());

		if (countTranpackByPid == 0 && tranpackPO.getProduction().getStatus() == ProductionPO.STATUS_INSTORE_SHORT) {
			tranpackPO.getProduction().setStatus(ProductionPO.STATUS_PLAN_SHORT);
			tranpackPO.getProduction().setPlanTime(DateUtil.getDateToTimestamp(new Date()));
		}

		tranpackPO.setStatus(tranpackVO.getStatus());
		tranpackPO.setPlanTime(DateUtil.getDateToTimestamp(new Date()));
		tranpackPO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		tranpackDao.update(tranpackPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int tranTranpack(TranpackVO tranpackVO, String userId) throws FLException {

		TranpackPO tranpackPO = tranpackDao.get(tranpackVO.getTid());

		if (tranpackPO == null) {
			throw new FLException(220023, "物流包不存在");
		}

		if (tranpackPO.getStatus() != TranpackPO.STATUS_LOGISTICS_SHORT) {
			throw new FLException(220025, "物流包状态不可操作");
		}

		Integer countTranpackByPid = tranpackDao.countTranpackByPid(tranpackPO.getProduction().getPid(), tranpackVO.getStatus(), tranpackPO.getTid());

		if (countTranpackByPid == 0 && tranpackPO.getProduction().getStatus() == ProductionPO.STATUS_PLAN_SHORT) {
			tranpackPO.getProduction().setStatus(ProductionPO.STATUS_TRANSPORT_SHORT);
			tranpackPO.getProduction().setTranTime(DateUtil.getDateToTimestamp(new Date()));
		}

		UserPO sender = userDao.queryUserByUserId(userId);

		tranpackPO.setSender(sender);
		tranpackPO.setStatus(tranpackVO.getStatus());
		tranpackPO.setTranTime(DateUtil.getDateToTimestamp(new Date()));
		tranpackPO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		tranpackDao.update(tranpackPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int mountTranpack(TranpackVO tranpackVO, String userId) throws FLException {

		TranpackPO tranpackPO = tranpackDao.get(tranpackVO.getTid());

		if (tranpackPO == null) {
			throw new FLException(220023, "物流包不存在");
		}

		if (tranpackPO.getStatus() != TranpackPO.STATUS_TRANSPORT_SHORT) {
			throw new FLException(220025, "物流包状态不可操作");
		}

		Integer countTranpackByPid = tranpackDao.countTranpackByPid(tranpackPO.getProduction().getPid(), tranpackVO.getStatus(), tranpackPO.getTid());

		if (countTranpackByPid == 0 && tranpackPO.getProduction().getStatus() == ProductionPO.STATUS_TRANSPORT_SHORT) {
			tranpackPO.getProduction().setStatus(ProductionPO.STATUS_MOUNT_SHORT);
			tranpackPO.getProduction().setMountTime(DateUtil.getDateToTimestamp(new Date()));
		}

		UserPO mounter = userDao.queryUserByUserId(userId);

		tranpackPO.setMounter(mounter);
		tranpackPO.setStatus(tranpackVO.getStatus());
		tranpackPO.setMountTime(DateUtil.getDateToTimestamp(new Date()));
		tranpackPO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		tranpackDao.update(tranpackPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int completeTranpack(TranpackVO tranpackVO) throws FLException {

		TranpackPO tranpackPO = tranpackDao.get(tranpackVO.getTid());

		if (tranpackPO == null) {
			throw new FLException(220023, "物流包不存在");
		}

		if (tranpackPO.getStatus() != TranpackPO.STATUS_INSTALLATION_SHORT) {
			throw new FLException(220025, "物流包状态不可操作");
		}

		Integer countTranpackByPid = tranpackDao.countTranpackByPid(tranpackPO.getProduction().getPid(), tranpackVO.getStatus(), tranpackPO.getTid());

		if (countTranpackByPid == 0 && tranpackPO.getProduction().getStatus() == ProductionPO.STATUS_MOUNT_SHORT) {
			tranpackPO.getProduction().setStatus(ProductionPO.STATUS_COMPLETE_SHORT);
		}

		tranpackPO.setStatus(tranpackVO.getStatus());
		tranpackPO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		tranpackDao.update(tranpackPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lossTranpack(TranpackVO tranpackVO) throws FLException {

		TranpackPO tranpackPO = tranpackDao.get(tranpackVO.getTid());

		if (tranpackPO == null) {
			throw new FLException(220023, "物流包不存在");
		}

		tranpackPO.setStatus(tranpackVO.getStatus());

		tranpackDao.update(tranpackPO);

		return 0;
	}

	// 更新添加物流包数据信息
	private void addTranpack(TranpackVO tranpackVO, String userId, ProductionPO productionPO, String no) {

		UserPO creater = userDao.queryUserByUserId(userId);

		TranpackPO tranpackPO = new TranpackPO(new ProductionPO(), new UserPO());
		BeanUtil.copyProperties(tranpackVO, tranpackPO, Arrays.asList("production", "creater", "sender", "mounter"));

		tranpackPO.setNo(no);
		tranpackPO.setCreater(creater);
		tranpackPO.setProduction(productionPO);
		tranpackPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		tranpackDao.save(tranpackPO);

		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		productionDao.update(productionPO);
	}

	// Copy赋值
	private TranpackVO copyTranpck(TranpackPO tranpackPO) {

		TranpackVO tranpackVO = new TranpackVO(new ProductionVO(new HouseVO(new VillageVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		BeanUtil.copyPropertie(tranpackPO, tranpackVO, Arrays.asList("production", "creater", "sender", "mounter"));
		BeanUtil.copyProperties(tranpackPO.getProduction(), tranpackVO.getProduction(), Arrays.asList("house", "creater", "brand", "salesman", "designer", "spliter"));
		BeanUtil.copyProperties(tranpackPO.getCreater(), tranpackVO.getCreater(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(tranpackPO.getSender(), tranpackVO.getSender(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(tranpackPO.getMounter(), tranpackVO.getMounter(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(tranpackPO.getProduction().getCreater(), tranpackVO.getProduction().getCreater(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(tranpackPO.getProduction().getSalesman(), tranpackVO.getProduction().getSalesman(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(tranpackPO.getProduction().getDesigner(), tranpackVO.getProduction().getDesigner(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(tranpackPO.getProduction().getSpliter(), tranpackVO.getProduction().getSpliter(), Arrays.asList("duty", "dept"));

		if (tranpackPO.getProduction().getHouse() != null) tranpackPO.getProduction().getHouse().ptv(tranpackVO.getProduction().getHouse());

		return tranpackVO;
	}
}
