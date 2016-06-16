package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.RoleActionDao;
import com.fanglin.system.dao.SubFunctionActionDao;
import com.fanglin.system.dao.SubFunctionDao;
import com.fanglin.system.po.RoleActionPO;
import com.fanglin.system.po.SubFunctionActionPO;
import com.fanglin.system.po.SubFunctionPO;
import com.fanglin.system.service.SubFunctionActionService;
import com.fanglin.system.vo.FunctionVO;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.system.vo.SubFunctionActionVO;
import com.fanglin.system.vo.SubFunctionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("subFunctionActionService")
@Transactional(readOnly = true)
public class SubFunctionActionServiceImpl implements SubFunctionActionService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private SubFunctionActionDao subFunctionActionDao;

	@Autowired
	private SubFunctionDao subFunctionDao;

	@Autowired
	private RoleActionDao roleActionDao;
	
	@Override
	public void pageSubFunctionAction(Paging paging, List<FilterVO> filters){

		List<SubFunctionActionPO> subFunctionActionPOs = subFunctionActionDao.pageSubFunctionAction(paging, filters);
		List<SubFunctionActionVO> subFunctionActionVOs = new ArrayList<SubFunctionActionVO>();

		for(SubFunctionActionPO subFunctionActionPO: subFunctionActionPOs){
			SubFunctionActionVO subFunctionActionVO = new SubFunctionActionVO();
			BeanUtil.copyProperties(subFunctionActionPO, subFunctionActionVO, Arrays.asList("subFunction"));

			SubFunctionVO subFunctionVO = new SubFunctionVO();
			BeanUtil.copyProperties(subFunctionActionPO.getSubFunction(), subFunctionVO, Arrays.asList("function"));

			FunctionVO functionVO = new FunctionVO();
			BeanUtil.copyProperties(subFunctionActionPO.getSubFunction().getFunction(), functionVO, Arrays.asList("module"));

			ModuleVO moduleVO = new ModuleVO();
			BeanUtil.copyProperties(subFunctionActionPO.getSubFunction().getFunction().getModule(), moduleVO);
			functionVO.setModule(moduleVO);
			
			subFunctionVO.setFunction(functionVO);
			subFunctionActionVO.setSubFunction(subFunctionVO);
			subFunctionActionVOs.add(subFunctionActionVO);
		}

		paging.setData(subFunctionActionVOs);
	}
	
	@Override
	public SubFunctionActionVO querySubFunctionActionByName(SubFunctionActionVO subFunctionAction){
		SubFunctionActionPO subFunctionActionPO = subFunctionActionDao.querySubFunctionActionByActionName(subFunctionAction.getActionName());
		SubFunctionActionVO subFunctionActionVO = new SubFunctionActionVO();
		
		if(subFunctionActionPO != null){
			BeanUtil.copyProperties(subFunctionActionPO, subFunctionActionVO, Arrays.asList("subFunction"));

			SubFunctionVO subVO = new SubFunctionVO();
			BeanUtil.copyProperties(subFunctionActionPO.getSubFunction(), subVO, Arrays.asList("function"));

			subFunctionActionVO.setSubFunction(subVO);
		}
		
		return subFunctionActionVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSubFunctionAction(SubFunctionActionVO subFunctionActionVO) throws FLException{
		SubFunctionActionPO subFunctionActionPO = subFunctionActionDao.querySubFunctionActionByActionName(subFunctionActionVO.getActionName());
		
		if(subFunctionActionPO == null){
			subFunctionActionPO = new SubFunctionActionPO();
			BeanUtil.copyProperties(subFunctionActionVO, subFunctionActionPO, Arrays.asList("subFunction"));

			SubFunctionPO subFunctionPO = subFunctionDao.querySubFunctionById(subFunctionActionVO.getSubFunction().getSubFunctionId());
			BeanUtil.copyProperties(subFunctionPO, subFunctionActionVO.getSubFunction(), Arrays.asList("function"));

			subFunctionActionPO.setSubFunction(subFunctionPO);
			subFunctionActionDao.saveOrUpdate(subFunctionActionPO);
		} else {
			throw new FLException(230009, "操作名称存在");
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSubFunctionAction(SubFunctionActionVO subFunctionAction) throws FLException{
		SubFunctionActionPO subFunctionActionPO = subFunctionActionDao.querySubFunctionActionByActionName(subFunctionAction.getActionName());
		
		if(subFunctionActionPO == null){
			subFunctionActionPO = new SubFunctionActionPO();
			BeanUtil.copyProperties(subFunctionAction, subFunctionActionPO, Arrays.asList("subFunction"));

			SubFunctionPO subFunctionPO = new SubFunctionPO();
			subFunctionPO.setSubFunctionId(subFunctionAction.getSubFunction().getSubFunctionId());

			subFunctionActionPO.setSubFunction(subFunctionPO);
			subFunctionActionDao.saveOrUpdate(subFunctionActionPO);
		} else if(subFunctionActionPO.getActionId() == subFunctionAction.getActionId()){
			BeanUtil.copyProperties(subFunctionAction, subFunctionActionPO, Arrays.asList("subFunction"));

			subFunctionActionPO.getSubFunction().setSubFunctionId(subFunctionAction.getSubFunction().getSubFunctionId());

			subFunctionActionDao.saveOrUpdate(subFunctionActionPO);
		} else {
			throw new FLException(230007, "操作名称已存在");
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteSubFunctionAction(int actionId){
		subFunctionActionDao.deleteById(actionId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public String deleteSubFunctionActions(List<Integer> actionIds){

		String quotedAction = "";
		for(Integer id: actionIds){
			List<RoleActionPO> roleActionList = roleActionDao.queryRoleActionByActionId(id);
			if(roleActionList.size() != 0){
				quotedAction += id + ",";
			}
		}

		if(quotedAction.equals("")){
			for(Integer id: actionIds){
				deleteSubFunctionAction(id);
			}
		}else{
			quotedAction = quotedAction.substring(0, quotedAction.length() - 1);
		}

		return quotedAction;
	}

}
