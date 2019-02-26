package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserLabelPO;

public interface UserLabelDao extends Dao<UserLabelPO> {

	public List<UserLabelPO> queryUserLabelByUid(Integer uid);

	public List<UserLabelPO> pickUserLabel(List<Integer> userLabel);

}
