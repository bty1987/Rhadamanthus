package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.department.dao.DepartmentDao;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.information.dao.NoticeDao;
import com.fanglin.information.dao.NoticeDepartmentDao;
import com.fanglin.information.po.NoticeDepartmentPO;
import com.fanglin.information.service.NoticeDepartmentService;
import com.fanglin.information.vo.NoticeDepartmentVO;
import com.fanglin.information.vo.NoticeVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("noticeDepartmentService")
@Transactional(readOnly = true)
public class NoticeDepartmentServiceImpl implements NoticeDepartmentService {

	@Autowired
	public UserDao userDao;

	@Autowired
	public NoticeDepartmentDao noticeDepartmentDao;

	@Autowired
	public DepartmentDao departmentDao;

	@Autowired
	public NoticeDao noticeDao;

	@Override
	public void queryNoticeDepartmentByNoticeIdandDepartment(Paging paging, NoticeVO noticeVO, String userId){
		UserPO userPO = userDao.queryUserByUserId(userId);
		List<String> deptIds = new ArrayList<String>();
		if(userId != null){
			
			if(!userPO.getRole().getRoleId().equals(RolePO.SUPER_ROLEID_STR)){

				if(userPO.getDept().getFatherDept() != null){
					deptIds.add(userPO.getDept().getDeptId());
					deptIds.add(userPO.getDept().getFatherDept().getDeptId());
				}else{

					deptIds = departmentDao.queryDepartmentForChildren(userPO.getDept().getDeptId());
					deptIds.add(userPO.getDept().getDeptId());
				}
			}
		}
		//noticeVO.getUser().getDept().setDid(userPO.getDept().getDid());
		List<NoticeDepartmentPO> noticeDepartmentPOs = noticeDepartmentDao.queryDepartmentIdNoticeId(userPO.getDept().getDid());
		
		List<NoticeDepartmentVO> noticeDepartmentVOs = new ArrayList<NoticeDepartmentVO>();

		int i = 0;
		
		for(NoticeDepartmentPO noticeDepartmentPO: noticeDepartmentPOs){
			
			System.out.println(i++);
			NoticeDepartmentVO noticeDepartmentVO = new NoticeDepartmentVO(new NoticeVO());
			
			BeanUtil.copyProperties(noticeDepartmentPO, noticeDepartmentVO, Arrays.asList("notice"));
			
			BeanUtil.copyProperties(noticeDepartmentPO.getNotice(), noticeDepartmentVO.getNotice(), Arrays.asList("user","dept"));
			
			UserVO userVO = new UserVO();
			noticeDepartmentVO.getNotice().setUser(userVO);
			
			BeanUtil.copyProperties(noticeDepartmentPO.getNotice().getUser(), noticeDepartmentVO.getNotice().getUser(), Arrays.asList("role","dept"));
			
			DepartmentVO departmentVO = new DepartmentVO();
			noticeDepartmentVO.getNotice().setDept(departmentVO);
			
			BeanUtil.copyProperties(noticeDepartmentPO.getNotice().getDept(), noticeDepartmentVO.getNotice().getDept(), Arrays.asList("fatherDept","cityProper"));
			
			noticeDepartmentVOs.add(noticeDepartmentVO);

		}
		
		paging.setData(noticeDepartmentVOs);

		
	}





}
