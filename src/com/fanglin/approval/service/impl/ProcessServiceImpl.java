
package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ProcessDao;
import com.fanglin.approval.dao.ProcessItemDao;
import com.fanglin.approval.po.ProcessItemPO;
import com.fanglin.approval.po.ProcessPO;
import com.fanglin.approval.service.ProcessService;
import com.fanglin.approval.vo.ProcessItemVO;
import com.fanglin.approval.vo.ProcessVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("processService")
@Transactional(readOnly = true)
public class ProcessServiceImpl implements ProcessService {

	@Autowired
	private ProcessDao processDao;
	
	@Autowired
	private ProcessItemDao processItemDao;

	@Override
	public void pageProcess(Paging paging, List<Filter> filters, int company) {
		
		filters.add(new Filter("company", String.valueOf(company), "eq"));
		
		List<ProcessPO> processPOs = processDao.pageProcess(paging, filters);
		List<ProcessVO> processVOs = new ArrayList<ProcessVO>();

		for(ProcessPO processPO: processPOs){
			processVOs.add(processPOToVO(processPO));
		}

		paging.setData(processVOs);
		
	}

	@Override
	public List<ProcessVO> queryProcess() {
		
		List<ProcessPO> processPOs = processDao.queryProcess();
		
		List<ProcessVO> processVOs = new ArrayList<ProcessVO>();

		for(ProcessPO processPO: processPOs){
			processVOs.add(processPOToVO(processPO));
		}
		
		return processVOs;

	}

	@Override
	public ProcessVO queryProcessByPid(ProcessVO process) {
		
		ProcessPO processPO = processDao.get(process.getPid());
		
		ProcessVO processVO = processPOToVO(processPO);
		
		return processVO;
		
	}

	@Override
	public List<ProcessItemVO> queryProcessItem(ProcessVO process) {
		
		List<ProcessItemPO> processItemPOs = processItemDao.queryProcessItem(process.getPid());
		List<ProcessItemVO> processItemVOs = new ArrayList<ProcessItemVO>();
		
		for (ProcessItemPO processItemPO : processItemPOs) {
			ProcessItemVO processItemVO = new ProcessItemVO();
			BeanUtil.copyProperties(processItemPO, processItemVO);
			processItemVOs.add(processItemVO);
		}
		
		return processItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addProcess(ProcessVO process, List<ProcessItemVO> processItems, int company) throws FLException {
		
		ProcessPO processPO = processDao.queryProcess(process.getNo());
		
		if (processPO != null) {
			throw new FLException(240012, "表单已存在");
		}
		
		processPO = new ProcessPO();
		
		BeanUtil.copyProperties(process, processPO);
		processPO.setStatus(ProcessPO.STATUS_ENABLED_INT);
		processPO.setCompany(company);
		
		processDao.save(processPO);
		
		for (ProcessItemVO processItem : processItems) {
			ProcessItemPO processItemPO = new ProcessItemPO();
			BeanUtil.copyProperties(processItem, processItemPO);
			processItemPO.setPid(processPO.getPid());
			processItemDao.save(processItemPO);
		}
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateProcess(ProcessVO process, List<ProcessItemVO> processItems) throws FLException {
		
		ProcessPO processPO = processDao.get(process.getPid());
		
		if (processPO == null) {
			throw new FLException(240011, "表单不存在");
		}
		
		BeanUtil.copyProperties(process, processPO, Arrays.asList("status", "company"));
		
		processDao.update(processPO);
		
		processItemDao.deleteProcessItem(process.getPid());
		
		for (ProcessItemVO processItem : processItems) {
			ProcessItemPO processItemPO = new ProcessItemPO();
			BeanUtil.copyProperties(processItem, processItemPO);
			processItemPO.setPid(processPO.getPid());
			processItemDao.save(processItemPO);
		}
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateProcessItem(ProcessItemVO processItem) {
		
		ProcessItemPO processItemPO = processItemDao.get(processItem.getPiid());
		
		BeanUtil.copyProperties(processItem, processItemPO, Arrays.asList("pid"));
		
		processDao.update(processItemPO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteProcessItem(ProcessItemVO processItem) {
		
		ProcessItemPO processItemPO = processItemDao.get(processItem.getPiid());
		
		if(processItemPO == null){
			new FLException(240013, "项目不存在");
		}
		
		processDao.delete(processItemPO);
		
	}
	
	public ProcessVO processPOToVO(ProcessPO processPO){
		
		ProcessVO processVO = new ProcessVO();

		BeanUtil.copyProperties(processPO, processVO);
		
		return processVO;
		
	}

}
