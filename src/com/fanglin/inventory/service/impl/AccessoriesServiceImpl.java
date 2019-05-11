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
import com.fanglin.construction.dao.ConstructionScheduleDao;
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

	@Override
	public void pageAccessories(Paging paging, List<Filter> filters, int company) {

		List<AccessoriesPO> accessoriesPOs = accessoriesDao.pageAccessories(paging, filters, company);
		List<AccessoriesVO> accessoriesVOs = new ArrayList<AccessoriesVO>();

		AccessoriesVO accessoriesVO;

		for (AccessoriesPO accessoriesPO : accessoriesPOs) {

			accessoriesVO = new AccessoriesVO(new HouseVO(new VillageVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(accessoriesPO, accessoriesVO, Arrays.asList("house", "creater", "approver", "supervisor"));
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
		
		if(status.contains(decorationPO.getStatus())){
			throw new FLException(140004, "装修单状态不可操作");
		}

		int company = decorationPO.getCompany();

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(orderId, accessoriesVO.getSchedule());
		
		if(constructionSchedulePO == null){
			throw new FLException(120024, "工程环节不存在");
		}
		
		if(constructionSchedulePO.getStatus() == ConstructionSchedulePO.STATUS_INIT_INT){
			throw new FLException(120025, "工程环节不可操作");
		}

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AO_INT, currentDate, company);
		String no = String.format("%sAO%s%s", companyPO.getShortname(), currentDate, FormatUtil.fillZero(FormatUtil.offset(count), "0000"));
		
		Timestamp fetchTime = accessoriesVO.getFetchTime();
		
		UserPO createrPO = userDao.queryUserByUserId(userId);

		AccessoriesPO accessoriesPO = new AccessoriesPO().init(no, orderId, constructionSchedulePO.getCsid(), decorationPO.getHouse(), createrPO, fetchTime, constructionSchedulePO.getSchedule(), company);
		
		if (accessoriesVO.getSupervisor() != null) {
			accessoriesPO.setSupervisor(userDao.queryUserByUserId(accessoriesVO.getSupervisor().getUserId()));
		}
		
		accessoriesDao.save(accessoriesPO);

		for (AccessoriesItemVO accessoriesItemVO : accessoriesItemVOs) {
			accessoriesItemDao.save(new AccessoriesItemPO().init(accessoriesPO.getAid(), accessoriesItemVO.getGoods().getGid(), accessoriesItemVO.getSelling(), accessoriesItemVO.getNum()));
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAccessoriesForStatus(AccessoriesVO accessoriesVO, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

		if (accessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (accessoriesPO.getStatus() != 0) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		accessoriesPO.setStatus(accessoriesVO.getStatus());
		accessoriesPO.setApprover(userPO);
		accessoriesPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));

		accessoriesDao.update(accessoriesPO);

		return 0;
	}

}
