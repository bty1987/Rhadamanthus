package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.vo.CrossCompanyRightVO;

public interface CrossCompanyRightService {

	// 消费侧: 返回可见公司集合(恒>=1元素且必含本公司, 升序); 无授权行时仅含本公司
	public List<Integer> queryCompanysForView(String userId, int company, String module);

	// 管理侧: 回显某用户的全部跨公司查看授权
	public List<CrossCompanyRightVO> queryCrossCompanyRightByUid(int uid) throws FLException;

	// 管理侧: 全量覆盖式保存某用户的授权(cids为空或module为空的行视为清除)
	public void updateCrossCompanyRight(int uid, List<CrossCompanyRightVO> crossCompanyRights, String userId) throws FLException;
}
