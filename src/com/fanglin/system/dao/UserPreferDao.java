package com.fanglin.system.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.system.po.UserPreferPO;

public interface UserPreferDao extends Dao<UserPreferPO> {

    public UserPreferPO queryUserPrefer(String userId, String module, String page, String pkey, int company);

}
