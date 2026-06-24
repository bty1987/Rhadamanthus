package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.UserPreferService;
import com.fanglin.personel.vo.UserPreferVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserPreferAction extends BaseListAction {

    private static final long serialVersionUID = -6473332409886761773L;

    @Autowired
    private UserPreferService userPreferService;

    private UserPreferVO userPrefer;

    private List<UserPreferVO> userPrefers;

    @Action(value = "queryUserPrefer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
    public String queryUserPrefer() throws FLException {

        userPrefer = userPreferService.queryUserPrefer(userPrefer, queryUserId(), queryCompany());

        return SUCCESS;
    }

    @Action(value = "queryUserPrefers", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
    public String queryUserPrefers() throws FLException {

        userPrefers = userPreferService.queryUserPrefers(userPrefer, queryUserId(), queryCompany());

        return SUCCESS;
    }

    @Action(value = "updateUserPrefer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
    public String updateUserPrefer() throws FLException {

        userPreferService.updateUserPrefer(userPrefer, queryUserId(), queryCompany());

        return SUCCESS;
    }

    public UserPreferVO getUserPrefer() {
        return userPrefer;
    }

    public void setUserPrefer(UserPreferVO userPrefer) {
        this.userPrefer = userPrefer;
    }

    public List<UserPreferVO> getUserPrefers() {
        return userPrefers;
    }

    public void setUserPrefers(List<UserPreferVO> userPrefers) {
        this.userPrefers = userPrefers;
    }

}
