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
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.inventory.dao.AccessoriesDao;
import com.fanglin.inventory.dao.AccessoriesItemDao;
import com.fanglin.inventory.po.AccessoriesItemPO;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.service.AccessoriesService;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("accessoriesService")
@Transactional(readOnly=true)
public class AccessoriesServiceImpl implements AccessoriesService {
	
	@Autowired
	private AccessoriesDao accessoriesDao;
	
	@Autowired
	private AccessoriesItemDao accessoriesItemDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageAccessories(Paging paging, List<Filter> filters,int company) {
		
		List<AccessoriesPO> accessoriesPOs = accessoriesDao.pageAccessories(paging, filters,company);
		List<AccessoriesVO> accessoriesVOs = new ArrayList<AccessoriesVO>();
		
		AccessoriesVO accessoriesVO;
		
		for(AccessoriesPO accessoriesPO: accessoriesPOs){
			
			accessoriesVO = new AccessoriesVO(new HouseVO(new VillageVO()),new UserBaseVO(),new UserBaseVO(),new UserBaseVO());
			
			BeanUtil.copyProperties(accessoriesPO, accessoriesVO, Arrays.asList("house","creater","approver","supervisor","fetchTime"));
			BeanUtil.copyProperties(accessoriesPO.getHouse(), accessoriesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyPropertie(accessoriesPO.getHouse().getVillage(), accessoriesVO.getHouse().getVillage(), Arrays.asList("cityProper","buildingNameRule"));
			
			accessoriesVO.getCreater().setBaseInfo(accessoriesPO.getCreater());
			accessoriesVO.getApprover().setBaseInfo(accessoriesPO.getApprover());
			accessoriesVO.getSupervisor().setBaseInfo(accessoriesPO.getSupervisor());
			
//			SimpleDateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			
			Timestamp now = accessoriesPO.getFetchTime();
			if(now != null){
				accessoriesVO.setFetchTime(now.toString());
			}
//			String str = df.format(now);
			
			accessoriesVOs.add(accessoriesVO);
		}

		paging.setData(accessoriesVOs);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addAccessories(AccessoriesVO accessoriesVO,List<AccessoriesItemVO> accessoriesItemVOs, String creater,String approver,int company) {
		
		String word = "AO";
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AO_INT,currentDate);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		String no = String.valueOf(word) + currentDate + endNo;
		
		AccessoriesPO accessoriesPO = new AccessoriesPO(no);
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(accessoriesVO.getOrderId());
		HousePO housePO = decorationPO.getHouse();
		
//		HousePO housePO = houseDao.get(accessoriesVO.getHouse().getHouseNumber());
		if(accessoriesVO.getSupervisor()!= null){
			UserPO supervisorPO = userDao.queryUserByUserId(accessoriesVO.getSupervisor().getUserId());
			accessoriesPO.setSupervisor(supervisorPO);
		}
		
		UserPO createrPO = userDao.queryUserByUserId(creater);
		UserPO approverPO = userDao.queryUserByUserId(approver);
		
		BeanUtil.copyProperties(accessoriesVO, accessoriesPO, Arrays.asList("house","supervisor","creater","approver","fetchTime"));
		accessoriesPO.setOrderId(accessoriesVO.getOrderId());
		accessoriesPO.setHouse(housePO);
		
		accessoriesPO.setCreater(createrPO);
		accessoriesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		accessoriesPO.setApprover(approverPO);
		accessoriesPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));

		Date date = DateUtil.parseDate(accessoriesVO.getFetchTime(), "yyyy-MM-dd");
		Timestamp end = DateUtil.getDateToTimestamp(date);
		accessoriesPO.setFetchTime(end);
		accessoriesPO.setCompany(company);
		accessoriesPO.setStatus(AccessoriesPO.STATUS_ENABLE_INT);
		accessoriesDao.save(accessoriesPO);
		
		AccessoriesItemPO accessoriesItemPO;
		
		for(AccessoriesItemVO accessoriesItemVO: accessoriesItemVOs){
			
			accessoriesItemPO = new AccessoriesItemPO(new GoodsPO());
			
			BeanUtil.copyProperties(accessoriesItemVO, accessoriesItemPO,Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(accessoriesItemVO.getGoods(), accessoriesItemPO.getGoods(),Arrays.asList("accessoriesType"));
			
			accessoriesItemPO.setAid(accessoriesPO.getAid());
			
			accessoriesItemDao.save(accessoriesItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAccessoriesForStatus(AccessoriesVO accessoriesVO,String userId)throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());
		
		if(accessoriesPO == null){
			throw new FLException(260023,"辅料单不存在");
		}
		
		if(accessoriesPO.getStatus() != 0){
			throw new FLException(260024,"辅料单状态不可操作");
		}
		
		accessoriesPO.setStatus(accessoriesVO.getStatus());
		accessoriesPO.setApprover(userPO);
		accessoriesPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));
		
		accessoriesDao.update(accessoriesPO);
		
		return 0;
	}

}
