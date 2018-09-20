package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ServiceNodeDao;
import com.fanglin.communion.po.ServiceNodePO;
import com.fanglin.communion.service.ServiceNodeService;
import com.fanglin.communion.vo.ServiceNodeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("serviceNodeService")
@Transactional(readOnly=true)
public class ServiceNodeServiceImpl implements ServiceNodeService{

	@Autowired
	private ServiceNodeDao serviceNodeDao;
	
	
	@Override
	public void pageServiceNode(Paging paging, List<Filter> filters, int company) {
		
		List<ServiceNodePO> serviceNodePOs = serviceNodeDao.pageServiceNode(paging, filters, company);
		List<ServiceNodeVO> serviceNodeVOs = new ArrayList<ServiceNodeVO>();
		
		for (ServiceNodePO serviceNodePO : serviceNodePOs) {
			
			ServiceNodeVO servcieNodeVO = new ServiceNodeVO();
			
			BeanUtil.copyProperties(serviceNodePO, servcieNodeVO);
			
			serviceNodeVOs.add(servcieNodeVO);
			
		}
		
		paging.setData(serviceNodeVOs);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addServiceNode(ServiceNodeVO serviceNodeVO) {
		
		ServiceNodePO serviceNodePO = new ServiceNodePO();
		BeanUtil.copyProperties(serviceNodeVO, serviceNodePO);
		serviceNodePO.setStatus(ServiceNodePO.SERVICESTATUS_ENABLE_INT);
		serviceNodePO.setCompany(ServiceNodePO.SERVICE_COMPANY_INIT);
		
		serviceNodeDao.save(serviceNodePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateServiceNode(ServiceNodeVO serviceNodeVO) throws FLException {
		
		ServiceNodePO serviceNodePO = serviceNodeDao.get(serviceNodeVO.getSnid());
		
		if(serviceNodePO == null){
			throw new FLException(130025,"服务节点不存在");
		}
		
		serviceNodePO.setName(serviceNodeVO.getName());
		serviceNodePO.setDetail(serviceNodeVO.getDetail());
		serviceNodePO.setType(serviceNodeVO.getType());
		
		serviceNodeDao.update(serviceNodePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateServiceNodeForStatus(ServiceNodeVO serviceNodeVO) throws FLException {
		
		ServiceNodePO serviceNodePO = serviceNodeDao.get(serviceNodeVO.getSnid());
		
		if(serviceNodePO == null){
			throw new FLException(130025,"服务节点不存在");
		}
		
		serviceNodePO.setStatus(serviceNodeVO.getStatus());
		
		serviceNodeDao.update(serviceNodePO);
		
		return 0;
	}

}
