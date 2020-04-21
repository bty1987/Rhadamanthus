package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ChartDao;
import com.fanglin.communion.dao.RoleChartDao;
import com.fanglin.communion.po.ChartPO;
import com.fanglin.communion.po.RoleChartPO;
import com.fanglin.communion.service.ChartService;
import com.fanglin.communion.vo.ChartVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("chartService")
@Transactional(readOnly = true)
public class ChartServiceImpl implements ChartService {

	@Autowired
	private ChartDao chartDao;
	
	@Autowired
	private RoleChartDao roleChartDao;
	
	@Autowired
	private RoleDao roleDao;
	
	@Override
	public void pageChart(Paging paging, List<Filter> filters) {
		
		List<ChartPO> chartPOs = chartDao.pageChart(paging, filters);
		List<ChartVO> chartVOs = new ArrayList<ChartVO>();
		
		for (ChartPO chartPO : chartPOs) {
			
			ChartVO chartVO = new ChartVO();
			
			BeanUtil.copyProperties(chartPO, chartVO);

			chartVOs.add(chartVO);
		}

		paging.setData(chartVOs);
	}

	@Override
	public List<ChartVO> queryChart() {
		
		List<ChartPO> chartPOs = chartDao.list();
		List<ChartVO> chartVOs = new ArrayList<ChartVO>();
		
		for (ChartPO chartPO : chartPOs) {
			
			ChartVO chartVO = new ChartVO();
			
			BeanUtil.copyProperties(chartPO, chartVO);

			chartVOs.add(chartVO);
		}
		
		return chartVOs;
	}

	@Override
	public List<ChartVO> queryChartByRid(RoleVO roleVO) {
		
		List<RoleChartPO> roleChartPOs = roleChartDao.queryChartByRid(roleVO.getRid());
		List<ChartVO> chartVOs = new ArrayList<ChartVO>();
		
		for (RoleChartPO roleChartPO : roleChartPOs) {
			ChartVO chartVO = new ChartVO();
			
			BeanUtil.copyProperties(roleChartPO.getChartPO(), chartVO);
			
			chartVOs.add(chartVO);
			
		}
		
		return chartVOs;
	}
	
	@Override
	public List<ChartVO> queryChartForLogin(RoleVO roleVO) {
		
		List<RoleChartPO> roleChartPOs = roleChartDao.queryChartByRid(roleVO.getRid());
		List<ChartVO> chartVOs = new ArrayList<ChartVO>();
		
		for (RoleChartPO roleChartPO : roleChartPOs) {
			
			ChartVO chartVO = new ChartVO();
			
			BeanUtil.copyProperties(roleChartPO.getChartPO(), chartVO);

			chartVOs.add(chartVO);
		}
		
		return chartVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRoleChartByRid(RoleVO roleVO, List<Long> cids, int rid) //rid:操作人的角色   roleVO:被操作人
			throws FLException {
		
		RolePO rolePO = roleDao.get(roleVO.getRid());
		
		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}
		
		RolePO roleCO = roleDao.get(rid);
		
		if (roleCO.getRid() == rolePO.getRid()) {
			throw new FLException(-1, "无操作权限");
		}
		
		if (roleCO.getLevel() < rolePO.getLevel()) {
			throw new FLException(-1, "无操作权限");
		}
		
		roleChartDao.deleteRoleChartByRid(rolePO.getRid());
		
		if (cids != null && cids.size() > 0) {
			
			for (Long cid : cids) {
				RoleChartPO roleChartPO = new RoleChartPO(rolePO.getRid(), new ChartPO(cid));
				
				roleChartDao.save(roleChartPO);
			}
		}
		
		return 0;
	}

}
