/**
 * @File Name	: ReworkServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ReworkDao;
import com.fanglin.construction.dao.ReworkDrawingDao;
import com.fanglin.construction.po.ReworkDrawingPO;
import com.fanglin.construction.po.ReworkPO;
import com.fanglin.construction.service.ReworkService;
import com.fanglin.construction.vo.ReworkVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("reworkService")
@Transactional(readOnly=true)
public class ReworkServiceImpl implements ReworkService{
	
	@Autowired
	private ReworkDao reworkDao;
	@Autowired
	private ReworkDrawingDao reworkDrawingDao;
	@Autowired
	private UserDao userDao;

	@Override
	public void pageRework(Paging paging, List<Filter> filters){
		
		List<ReworkPO> reworkPOs = reworkDao.pageRework(paging, filters);
		List<ReworkVO> reworkVOs = new ArrayList<ReworkVO>();
		
		for(ReworkPO reworkPO: reworkPOs){
			ReworkVO reworkVO = new ReworkVO();
			BeanUtil.copyProperties(reworkPO, reworkVO);
			reworkVOs.add(reworkVO);
		}
		
		paging.setData(reworkVOs);
	}

	@Override
	public void pageReworkByOrderId(Paging paging, List<Filter> filters, ReworkVO reworkVO){
		
		List<ReworkPO> reworkPOs = reworkDao.pageReworkByOrderId(paging, filters, reworkVO.getOrderId());
		List<ReworkVO> reworkVOs = new ArrayList<ReworkVO>();
		
		for(ReworkPO reworkPO: reworkPOs){
			ReworkVO _reworkVO = new ReworkVO();
			BeanUtil.copyProperties(reworkPO, _reworkVO);
			reworkVOs.add(_reworkVO);
		}
		
		paging.setData(reworkVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateRework(ReworkVO reworkVO){
		
		ReworkPO reworkPO = new ReworkPO();
		BeanUtil.copyProperties(reworkVO, reworkPO);
		
		if(reworkVO.getCreaterId() != null && !reworkVO.getCreaterId().equals("")){
			UserPO user = userDao.queryUserByUserId(reworkVO.getCreaterId());
			reworkPO.setCuid(user.getUid());
		}
		
		reworkDao.saveOrUpdate(reworkPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateRework(ReworkVO reworkVO){
		
		ReworkPO reworkPO = reworkDao.get(reworkVO.getRwId());
		
		reworkPO.setCreateTime(reworkVO.getCreateTime());
		reworkPO.setReworkDes(reworkVO.getReworkDes());
		
		reworkDao.saveOrUpdate(reworkPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteReworkById(int reworkId){
		
		reworkDao.deleteById(reworkId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteRework(ReworkVO reworkVO){
		
		ReworkPO reworkPO = new ReworkPO();
		BeanUtil.copyProperties(reworkVO, reworkPO);
		reworkDao.delete(reworkPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteRework(List<String> rwIds){

		for(String rwId: rwIds){
			ReworkPO reworkPO = reworkDao.get(Integer.valueOf(rwId));
			if(reworkPO != null){
				reworkDao.delete(reworkPO);
				List<ReworkDrawingPO> reworkDrawingPOs = reworkDrawingDao.queryDrawingByReworkId(Integer.parseInt(rwId));
				for(ReworkDrawingPO reworkDrawingPO: reworkDrawingPOs){
					reworkDrawingDao.delete(reworkDrawingPO);
				}
			}
		}
	}

}
