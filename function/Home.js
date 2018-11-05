
function  NewRegisterAdvertising (con,DataApp,Error,CallBack) 
{
  con.connect(function(err)
  {
    if (err)
    {
     
      Error(err);
      
    } else
    {
      var Header=DataApp.HeaderRequest;
      console.log(DataApp.Mobile);
      var Sql=`INSERT INTO tregisteradvertising (Id_Request,Id_User,NameAdvertising,Tel1,Mobile1) VALUES(${Header.Id_Request},
        ${Header.Id_User},'${DataApp.NameAdvertising}','${DataApp.Tel}','${DataApp.Mobile}')`;
        console.log(Sql);
      con.query(Sql,function (err, result)
      {
        if (err)
        {
          Error(err);
        } else
        {
          CallBack(result);
        }
        con.end();
      });
    }
  });    
}
function  UpdateRegisterAdvertising (con,DataApp,Error,CallBack) 
{
  con.connect(function(err)
  {
    if (err)
    {
      Error(err);
      
    } else
    {
      var Header=DataApp.HeaderRequest;
      console.log(DataApp.Mobile);
      var Sql=`update tregisteradvertising  set NameAdvertising='${DataApp.NameAdvertising}',Tel1='${DataApp.Tel}',Mobile1='${DataApp.Mobile}'
       where Id_Request=${Header.Id_Request}`;
        console.log(Sql);
      con.query(Sql,function (err, result)
      {
        if (err)
        {
          Error(err);
        } else
        {
          CallBack(result);
        }
        con.end();
      });
    }
  });    
}
function  SaveSaleApartmentResidential (con,DataApp,Error,CallBack) 
{
  var Date=require("./Date_F.js")
  con.connect(function(err)
  {
    if (err)
    {

      Error(err);
      
    } else
    {
      var data=DataApp.Data;
      var Header=DataApp.HeaderRequest;
      var Sql=`INSERT INTO thome(Id_Request`;
      if (data.LogoHome!="") Sql=Sql+`,LogoHome`;
      Sql=Sql+`,Id_Rl_thomebussinece,Description,Tp_Home,Ostan,City,Zone,Address,Tel,Latitude,Longtitude,
              DateStart,Tp_LevelAdvertising,RequestView,Status,Tp_RegistrationAdvertising) VALUES 
              (${Header.Id_Request}`;
      if (data.LogoHome!="") Sql=Sql+`,'${Header.Id_Request}.png'`;        
        Sql = Sql + `,${data.Id_User},'${data.SubjectAdvertising}',1,${data.Id_Ostan},${data.Id_City},${data.Id_Zone}
                ,'${data.Address}','${data.Tel}',${data.Latitude},${data.Longtitude},${Date.GetDateCurrent()},${data.Id_TimeAdvertising},
                0,1,${data.Tp_RegistrationAdvertising})`;
      con.query(Sql,function (err, resultthome)
      {

        if (err)
        {
            console.log(err);
          Error(err);
        } else
        {
          Sql = `INSERT INTO thomesaleapartmentresidential(Id_Rl_Thome,AgeBuilding,NumberRoom,Tp_Bottom,
          Tp_Kitchen,Tp_Wall,Zirbana,Tp_Teras,PriceApartment,Description_HomeBussinece,Description_MalekHome,
          Tabaghe,Vahed,Tp_ArrowHome,Tp_Water,Tp_Bargh,Tp_Gaz,Tp_Tel,Tp_Garmayesh,Tp_Asansoor,
          MoneyVam,AghsatVam,Tp_MohafezDoorVoroodi,Tp_Camera,Tp_Parking,Tp_Anbari,Tp_SanadApartment,
          Tp_StatusDischarge,Tp_NamaBuilding) VALUES (${resultthome.insertId},${data.AgeBuliding},
          ${data.NumberRoom},${data.Id_Bottom},${data.Id_Kitchen},${data.Id_Wall},${data.Zirbana},
          ${data.Id_Teras},${data.MoneySale},'${data.DescriptionMoshaver}','${data.DescriptionOwnerHomer}',
          ${data.Tabaghe},${data.Vahed},${data.Id_Arrow},${data.Id_Water},${data.Id_Bargh},${data.Id_Gaz},
          ${data.Id_LineTel},${data.Id_Garmayesh},${data.Id_Asansoor},${data.Vam},${data.Installment},
          ${data.Id_MohafezDoor},${data.Id_Camera},${data.Id_Parking},${data.Id_Anbari},${data.Id_Sanad},
          ${data.Id_StatusDischarge},${data.Id_Nama})`;

            con.query(Sql, function (err, res)
          {
            if (err)
            {

              Error(err);
            } else
            {
              if (data.LogoHome!="")
              {

                var base64Img = require('base64-img');
                base64Img.img('data:image/png;base64,'+data.LogoHome, 'Image/Home', Header.Id_Request, function(err, filepath) 
                {
                  
                });
                var Res_CallBack={Id:resultthome.insertId,Id_Request:Header.Id_Request,
                Date:Date.GetDateCurrent(),RequestView:0,LogoHome:Header.Id_Request+'.png'};
                CallBack(Res_CallBack);
              } else
              {
                var Res_CallBack={Id:resultthome.insertId,Id_Request:Header.Id_Request,
                Date:Date.GetDateCurrent(),RequestView:0};
                CallBack(Res_CallBack);
              }
            }                            
          });              
        }
        con.end();
      });
    }
  });    
}
function  UpdateSaleApartmentResidential (con,DataApp,Error,CallBack) 
{
  var Header=DataApp.HeaderRequest;
  var data=DataApp.Data;  
  var Date=require("./Date_F.js")
  var fs = require('fs');
  con.connect(function(err)
  {
    if (err)
    {

      Error(err);
      
    } else
    {

      var Sql=`update thome set `;
      if (data.LogoHome!="") Sql=Sql+` LogoHome='${Header.Id_Request}.png',`; else Sql=Sql+` LogoHome='',`;
        Sql = Sql + `Description='${data.SubjectAdvertising}',Ostan=${data.Id_Ostan},City=${data.Id_City}
      ,Zone=${data.Id_Zone},Address='${data.Address}',Tel='${data.Tel}',Latitude=${data.Latitude},Longtitude=${data.Longtitude},
              DateStart=${Date.GetDateCurrent()},Tp_LevelAdvertising=${data.Id_TimeAdvertising},
              Tp_RegistrationAdvertising=${data.Tp_RegistrationAdvertising} where Id_Request='${Header.Id_Request}' `;
      con.query(Sql,function (err, resultthome)
      {
       Sql=`Update thomesaleapartmentresidential set AgeBuilding=${data.AgeBuliding},
       NumberRoom= ${data.NumberRoom},Tp_Bottom=${data.Id_Bottom},Tp_Kitchen=${data.Id_Kitchen},
       Tp_Wall=${data.Id_Wall},Zirbana=${data.Zirbana},Tp_Teras=${data.Id_Teras},
       PriceApartment=${data.MoneySale},Description_HomeBussinece='${data.DescriptionMoshaver}'
       ,Description_MalekHome='${data.DescriptionOwnerHomer}',Tabaghe=${data.Tabaghe},
       Vahed=${data.Vahed},Tp_ArrowHome=${data.Id_Arrow},Tp_Water=${data.Id_Water},Tp_Bargh=${data.Id_Bargh}
       ,Tp_Gaz=${data.Id_Gaz},Tp_Tel=${data.Id_LineTel},Tp_Garmayesh=${data.Id_Garmayesh},
       Tp_Asansoor=${data.Id_Garmayesh},MoneyVam=${data.Vam},AghsatVam=${data.Installment},
       Tp_MohafezDoorVoroodi= ${data.Id_MohafezDoor},Tp_Camera=${data.Id_Camera},Tp_Parking=${data.Id_Parking}
       ,Tp_Anbari=${data.Id_Anbari},Tp_SanadApartment=${data.Id_Sanad},Tp_StatusDischarge= ${data.Id_StatusDischarge}
       ,Tp_NamaBuilding=${data.Id_Nama}  where Id_Rl_Thome=${data.IdHome}`;

        if (err)
        {
          console.log(err);
          Error(err);
          
        } else
        {
          con.query(Sql,function (err, res)
          {
            if (err)
            {
              console.log(err);
              Error(err);
            } else
            {
               
              if (data.LogoHome!="")
              {
                  console.log('fffffffff');
                  console.log(Header.Id_Request);

                  if (data.ChangePhoto == 2) {
                      fs.stat('./Image/Home/' + Header.Id_Request + '.png', function (err, stats) {

                          if (err) {
                              var base64Img = require('base64-img');
                              base64Img.img('data:image/png;base64,' + data.LogoHome, 'Image/Home', Header.Id_Request, function (err, filepath) {


                              });
                              var Res_CallBack = {
                                  Id: data.IdHome, Id_Request: Header.Id_Request,
                                  Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png'
                              };
                              CallBack(Res_CallBack);
                          } else {

                              fs.unlinkSync('Image/Home/' + Header.Id_Request + '.png');
                              var base64Img = require('base64-img');
                              base64Img.img('data:image/png;base64,' + data.LogoHome, 'Image/Home', Header.Id_Request, function (err, filepath) {


                              });
                              var Res_CallBack = {
                                  Id: data.IdHome, Id_Request: Header.Id_Request,
                                  Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png'
                              };
                              CallBack(Res_CallBack);

                          }


                      });
                  } else if (data.ChangePhoto == 1)
                  {
                      console.log('vvvvvvvvvvvv');
                      var Res_CallBack = {
                          Id: data.IdHome, Id_Request: Header.Id_Request,
                         Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png' };
                      CallBack(Res_CallBack);
                  }

              } else
              {
                  
                  var Res_CallBack = {
                      Id: data.IdHome, Id_Request: Header.Id_Request,
                      Date: Date.GetDateCurrent(), RequestView: 0
                  };
                  CallBack(Res_CallBack);

              }
 
            }                            
          });              
        }
        con.end();
      });
    }
  });    
}
function  SaveRentApartmentResidential (con,DataApp,Error,CallBack) 
{
  var Date=require("./Date_F.js")
  con.connect(function(err)
  {
    if (err)
    {

      Error(err);
      
    } else
    {
      var data=DataApp.Data;
      var Header=DataApp.HeaderRequest;
      var Sql=`INSERT INTO thome(Id_Request`;
      if (data.LogoHome!="") Sql=Sql+`,LogoHome`;
      Sql=Sql+`,Id_Rl_thomebussinece,Description,Tp_Home,Ostan,City,Zone,Address,Tel,Latitude,Longtitude,
              DateStart,Tp_LevelAdvertising,RequestView,Status,Tp_RegistrationAdvertising) VALUES 
              (${Header.Id_Request}`;
      if (data.LogoHome!="") Sql=Sql+`,'${Header.Id_Request}.png'`;        
        Sql = Sql + `,${data.Id_User},'${data.SubjectAdvertising}',2,${data.Id_Ostan},${data.Id_City},${data.Id_Zone}
                ,'${data.Address}','${data.Tel}',${data.Latitude},${data.Longtitude},${Date.GetDateCurrent()},${data.Id_TimeAdvertising},
                0,1,${data.Tp_RegistrationAdvertising})`;
				console.log(data);
      con.query(Sql,function (err, resultthome)
      {
        if (err)
        {
          Error(err);
        } else
        {
          Sql = `INSERT INTO thomerentapartmentresidential(Id_Rl_Thome,AgeBuilding,NumberRoom,Tp_Bottom,
          Tp_Kitchen,Tp_Wall,Zirbana,Tp_Teras,Description_HomeBussinece,Description_MalekHome,
          Tabaghe,Vahed,Tp_ArrowHome,Tp_Water,Tp_Bargh,Tp_Gaz,Tp_Tel,Tp_Garmayesh,Tp_Asansoor,
          Tp_MohafezDoorVoroodi,Tp_Camera,Tp_Parking,Tp_Anbari,Tp_SanadApartment,
          Tp_NamaBuilding,MoneyMortgage,MoneyRent,Tp_ConvertMortgageRent,Tp_StatusOwner,Tp_StatusDischarge)
          VALUES (${resultthome.insertId},${data.AgeBuliding},
          ${data.NumberRoom},${data.Id_Bottom},${data.Id_Kitchen},${data.Id_Wall},${data.Zirbana},
          ${data.Id_Teras},'${data.DescriptionMoshaver}','${data.DescriptionOwnerHomer}',
          ${data.Tabaghe},${data.Vahed},${data.Id_Arrow},${data.Id_Water},${data.Id_Bargh},${data.Id_Gaz},
          ${data.Id_LineTel},${data.Id_Garmayesh},${data.Id_Asansoor},
          ${data.Id_MohafezDoor},${data.Id_Camera},${data.Id_Parking},${data.Id_Anbari},${data.Id_Sanad},
          ${data.Id_Nama},${data.MoneyMortgage},${data.MoneyRent},${data.Id_ConvertMortgageRent},
          ${data.Id_StatusOwner},${data.Id_StatusDischarge})`;

            con.query(Sql, function (err, res)
          {
            if (err)
            {
              Error(err);
            } else
            {
                if (data.LogoHome != "") {

                    var base64Img = require('base64-img');
                    base64Img.img('data:image/png;base64,' + data.LogoHome, 'Image/Home', Header.Id_Request, function (err, filepath) {

                    });
                    var Res_CallBack = {
                        Id: resultthome.insertId, Id_Request: Header.Id_Request,
                        Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png'
                    };
                    CallBack(Res_CallBack);
                } else {
                    console.log(resultthome);
                    var Res_CallBack = {
                        Id: resultthome.insertId, Id_Request: Header.Id_Request,
                        Date: Date.GetDateCurrent(), RequestView: 0
                    };
                    CallBack(Res_CallBack);
                }
             
            }                            
          });              
        }
        con.end();
      });
    }
  });    
}
function  UpdateRentApartmentResidential (con,DataApp,Error,CallBack) 
{
  var Header=DataApp.HeaderRequest;
  var data=DataApp.Data;  
  var Date=require("./Date_F.js")
  con.connect(function(err)
  {
    if (err)
    {

      Error(err);
      
    } else
    {

      var Sql=`update thome set `;
      if (data.LogoHome!="") Sql=Sql+` LogoHome='${Header.Id_Request}.png',`; else Sql=Sql+` LogoHome='',`;
      Sql=Sql+`Description='${data.SubjectAdvertising}',Ostan=${data.Id_Ostan},City=${data.Id_City}
      ,Zone=${data.Id_Zone},Latitude=${data.Latitude},Longtitude=${data.Longtitude},
              DateStart=${Date.GetDateCurrent()},Tp_LevelAdvertising=${data.Id_TimeAdvertising},
              Tp_RegistrationAdvertising=${data.Tp_RegistrationAdvertising} where Id_Request='${Header.Id_Request}' `;
      con.query(Sql,function (err, resultthome)
      {
       Sql=`update thomerentapartmentresidential set AgeBuilding=${data.AgeBuliding},NumberRoom=${data.NumberRoom}
       ,Tp_Bottom=${data.Id_Bottom},Tp_Kitchen=${data.Id_Kitchen},Tp_Wall=${data.Id_Wall},
       Zirbana=${data.Zirbana},Tp_Teras=${data.Id_Teras},Description_HomeBussinece='${data.DescriptionMoshaver}'
       ,Description_MalekHome='${data.DescriptionOwnerHomer}',Tabaghe=${data.Tabaghe},Vahed=${data.Vahed}
       ,Tp_ArrowHome=${data.Id_Arrow},Tp_Water=${data.Id_Water},Tp_Bargh=${data.Id_Bargh},Tp_Gaz=${data.Id_Gaz}
       ,Tp_Tel= ${data.Id_LineTel},Tp_Garmayesh=${data.Id_Garmayesh},Tp_Asansoor=${data.Id_Asansoor},
        Tp_MohafezDoorVoroodi=${data.Id_MohafezDoor},Tp_Camera=${data.Id_Camera},Tp_Parking=${data.Id_Parking}
        ,Tp_Anbari=${data.Id_Anbari},Tp_SanadApartment=${data.Id_Sanad},
        Tp_NamaBuilding=${data.Id_Nama},MoneyMortgage=${data.MoneyMortgage},MoneyRent=${data.MoneyRent}
        ,Tp_ConvertMortgageRent=${data.Id_ConvertMortgageRent},Tp_StatusOwner=${data.Id_StatusOwner}
        ,Tp_StatusDischarge=${data.Id_StatusDischarge} where Id_Rl_Thome=${data.IdHome}`;
        if (err)
        {
          Error(err);
        } else
        {
          con.query(Sql,function (err, res)
          {
            if (err)
            {
              Error(err);
            } else
            {
                if (data.LogoHome != "") {
                    var fs = require('fs');

                    if (data.ChangePhoto == 2) {
                        fs.stat('./Image/Home/' + Header.Id_Request + '.png', function (err, stats) {

                            if (err) {
                                var base64Img = require('base64-img');
                                base64Img.img('data:image/png;base64,' + data.LogoHome, 'Image/Home', Header.Id_Request, function (err, filepath) {


                                });
                                var Res_CallBack = {
                                    Id: data.IdHome, Id_Request: Header.Id_Request,
                                    Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png'
                                };
                                CallBack(Res_CallBack);
                            } else {

                                fs.unlinkSync('Image/Home/' + Header.Id_Request + '.png');
                                var base64Img = require('base64-img');
                                base64Img.img('data:image/png;base64,' + data.LogoHome, 'Image/Home', Header.Id_Request, function (err, filepath) {


                                });
                                var Res_CallBack = {
                                    Id: data.IdHome, Id_Request: Header.Id_Request,
                                    Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png'
                                };
                                CallBack(Res_CallBack);

                            }


                        });
                    } else if (data.ChangePhoto == 1) {
                        console.log('vvvvvvvvvvvv');
                        var Res_CallBack = {
                            Id: data.IdHome, Id_Request: Header.Id_Request,
                            Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png'
                        };
                        CallBack(Res_CallBack);
                    }

                } else {

                    var Res_CallBack = {
                        Id: data.IdHome, Id_Request: Header.Id_Request,
                        Date: Date.GetDateCurrent(), RequestView: 0
                    };
                    CallBack(Res_CallBack);

                }


            }                            
          });              
        }
        con.end();
      });
    }
  });    
}
function  SaveSaleApartmentCommercial (con,DataApp,Error,CallBack) 
{
  var Date=require("./Date_F.js")
  con.connect(function(err)
  {
    if (err)
    {

      Error(err);
      
    } else
    {
      var data=DataApp.Data;
      var Header=DataApp.HeaderRequest;
      console.log(DataApp.HeaderRequest);
      var Sql=`INSERT INTO thome(Id_Request`;
      if (data.LogoHome!="") Sql=Sql+`,LogoHome`;
      Sql=Sql+`,Id_Rl_thomebussinece,Description,Tp_Home,Ostan,City,Zone,Address,Tel,Latitude,Longtitude,
              DateStart,Tp_LevelAdvertising,RequestView,Status,Tp_RegistrationAdvertising) VALUES 
              (${Header.Id_Request}`;
      if (data.LogoHome!="") Sql=Sql+`,'${Header.Id_Request}.png'`;        
        Sql = Sql + `,${data.Id_User},'${data.SubjectAdvertising}',3,${data.Id_Ostan},${data.Id_City},${data.Id_Zone}
                ,'${data.Address}','${data.Tel}',${data.Latitude},${data.Longtitude},${Date.GetDateCurrent()},${data.Id_TimeAdvertising},
                0,1,${data.Tp_RegistrationAdvertising})`;
      con.query(Sql,function (err, resultthome)
      {

        if (err)
        {
          Error(err);
        } else
        {
            Sql = `INSERT INTO thomesaleapartmentcommercial(Id_Rl_Thome,AgeBuilding,NumberRoom,Tp_Bottom,
        Tp_Kitchen,Tp_Wall,Zirbana,Tp_Teras,PriceApartment,Description_HomeBussinece,Description_MalekHome,
        Tabaghe,Vahed,Tp_ArrowHome,Tp_Water,Tp_Bargh,Tp_Gaz,Tp_Tel,Tp_Garmayesh,Tp_Asansoor,
        MoneyVam,AghsatVam,Tp_MohafezDoorVoroodi,Tp_Camera,Tp_Parking,Tp_Anbari,Tp_Sanad,
        Tp_StatusDischarge,Tp_NamaBuilding,Tp_StatusLocation,Tp_Commercial) VALUES (${resultthome.insertId},${data.AgeBuliding},
          ${data.NumberRoom},${data.Id_Bottom},${data.Id_Kitchen},${data.Id_Wall},${data.Zirbana},
          ${data.Id_Teras},${data.MoneySale},'${data.DescriptionMoshaver}','${data.DescriptionOwnerHomer}',
          ${data.Tabaghe},${data.Vahed},${data.Id_Arrow},${data.Id_Water},${data.Id_Bargh},${data.Id_Gaz},
          ${data.Id_LineTel},${data.Id_Garmayesh},${data.Id_Asansoor},${data.Vam},${data.Installment},
          ${data.Id_MohafezDoor},${data.Id_Camera},${data.Id_Parking},${data.Id_Anbari},${data.Id_Sanad},
          ${data.Id_StatusDischarge},${data.Id_Nama},${data.Id_StatusLocation},${data.Id_Commercial})`;
          con.query(Sql,function (err, res)
          {
            if (err)
            {

              Error(err);
            } else
            {
              if (data.LogoHome!="")
              {

                var base64Img = require('base64-img');
                base64Img.img('data:image/png;base64,'+data.LogoHome, 'Image/Home', Header.Id_Request, function(err, filepath) 
                {
                  
                });
                var Res_CallBack={Id:resultthome.insertId,Id_Request:Header.Id_Request,
                Date:Date.GetDateCurrent(),RequestView:0,LogoHome:Header.Id_Request+'.png'};
                CallBack(Res_CallBack);
              } else
              {
                var Res_CallBack={Id:resultthome.insertId,Id_Request:Header.Id_Request,
                Date:Date.GetDateCurrent(),RequestView:0};
                CallBack(Res_CallBack);
              }
            }                            
          });              
        }
        con.end();
      });
    }
  });    
} 
function  UpdateSaleApartmentCommercial (con,DataApp,Error,CallBack) 
{
  var Header=DataApp.HeaderRequest;
  var data=DataApp.Data;  
  var Date=require("./Date_F.js")
  con.connect(function(err)
  {
    if (err)
    {

      Error(err);
      
    } else
    {

      var Sql=`update thome set `;
      if (data.LogoHome!="") Sql=Sql+` LogoHome='${Header.Id_Request}.png',`; else Sql=Sql+` LogoHome='',`;
      Sql=Sql+`Description='${data.SubjectAdvertising}',Ostan=${data.Id_Ostan},City=${data.Id_City}
      ,Zone=${data.Id_Zone},Address='${data.Id_Zone}',Tel='${data.Tel}',Latitude=${data.Latitude},Longtitude=${data.Longtitude},
              DateStart=${Date.GetDateCurrent()},Tp_LevelAdvertising=${data.Id_TimeAdvertising},
              Tp_RegistrationAdvertising=${data.Tp_RegistrationAdvertising} where Id_Request='${Header.Id_Request}' `;
      con.query(Sql,function (err, resultthome)
      {
        if (err)
        {
          Error(err);
        } else
        {
          Sql = `update thomesaleapartmentcommercial set AgeBuilding=${data.AgeBuliding},NumberRoom=${data.NumberRoom}
          ,Tp_Bottom=${data.Id_Bottom},Tp_Kitchen=${data.Id_Kitchen},Tp_Wall=${data.Id_Wall},
          Zirbana=${data.Zirbana},Tp_Teras=${data.Id_Teras},Description_HomeBussinece='${data.DescriptionMoshaver}'
          ,Description_MalekHome='${data.DescriptionOwnerHomer}',Tabaghe=${data.Tabaghe},Vahed=${data.Vahed}
          ,Tp_ArrowHome=${data.Id_Arrow},Tp_Water=${data.Id_Water},Tp_Bargh=${data.Id_Bargh},Tp_Gaz=${data.Id_Gaz}
          ,Tp_Tel= ${data.Id_LineTel},Tp_Garmayesh=${data.Id_Garmayesh},Tp_Asansoor=${data.Id_Asansoor},
          Tp_MohafezDoorVoroodi=${data.Id_MohafezDoor},Tp_Camera=${data.Id_Camera},Tp_Parking=${data.Id_Parking}
        ,Tp_Anbari=${data.Id_Anbari},Tp_Sanad=${data.Id_Sanad}
       ,Tp_NamaBuilding=${data.Id_Nama},MoneyVam=${data.Vam},AghsatVam=${data.Installment}
        ,Tp_StatusDischarge=${data.Id_StatusDischarge},Tp_StatusLocation=${data.Id_StatusLocation}
        ,Tp_Commercial=${data.Id_Commercial} where Id_Rl_Thome=${data.IdHome}`;
            console.log(Sql);
            
            con.query(Sql, function (err, res)
          {
            if (err)
            {
              Error(err);
            } else
            {
                var fs = require('fs');
                if (data.LogoHome != "") {
                    console.log('fffffffff');
                    console.log(Header.Id_Request);

                    if (data.ChangePhoto == 2) {

                        fs.stat('./Image/Home/' + Header.Id_Request + '.png', function (err, stats) {

                            if (err) {
                                var base64Img = require('base64-img');
                                base64Img.img('data:image/png;base64,' + data.LogoHome, 'Image/Home', Header.Id_Request, function (err, filepath) {


                                });
                                var Res_CallBack = {
                                    Id: data.IdHome, Id_Request: Header.Id_Request,
                                    Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png'
                                };
                                CallBack(Res_CallBack);
                            } else {

                                fs.unlinkSync('Image/Home/' + Header.Id_Request + '.png');
                                var base64Img = require('base64-img');
                                base64Img.img('data:image/png;base64,' + data.LogoHome, 'Image/Home', Header.Id_Request, function (err, filepath) {


                                });
                                var Res_CallBack = {
                                    Id: data.IdHome, Id_Request: Header.Id_Request,
                                    Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png'
                                };
                                CallBack(Res_CallBack);

                            }


                        });
                    } else if (data.ChangePhoto == 1) {
                        console.log('vvvvvvvvvvvv');
                        var Res_CallBack = {
                            Id: data.IdHome, Id_Request: Header.Id_Request,
                            Date: Date.GetDateCurrent(), RequestView: 0, LogoHome: Header.Id_Request + '.png'
                        };
                        CallBack(Res_CallBack);
                    }

                } else {

                    var Res_CallBack = {
                        Id: data.IdHome, Id_Request: Header.Id_Request,
                        Date: Date.GetDateCurrent(), RequestView: 0
                    };
                    CallBack(Res_CallBack);

                }



            }                            
          });              
        }
        con.end();
      });
    }
  });    
}
function  SaveRentApartmentCommercial (con,DataApp,Error,CallBack) 
{
  var Date=require("./Date_F.js")
  con.connect(function(err)
  {
    if (err)
    {

      Error(err);
      
    } else
    {
      var data=DataApp.Data;
      var Header=DataApp.HeaderRequest;
      var Sql=`INSERT INTO thome(Id_Request`;
      if (data.LogoHome!="") Sql=Sql+`,LogoHome`;
      Sql=Sql+`,Id_Rl_thomebussinece,Description,Tp_Home,Ostan,City,Zone,Latitude,Longtitude,
              DateStart,Tp_LevelAdvertising,RequestView,Status,Tp_RegistrationAdvertising) VALUES 
              (${Header.Id_Request}`;
      if (data.LogoHome!="") Sql=Sql+`,'${Header.Id_Request}.png'`;        
      Sql=Sql+`,${data.Id_User},'${data.SubjectAdvertising}',4,${data.Id_Ostan},${data.Id_City},${data.Id_Zone}
                ,${data.Latitude},${data.Longtitude},${Date.GetDateCurrent()},${data.Id_TimeAdvertising},
                0,1,${data.Tp_RegistrationAdvertising})`;
				console.log(data);
      con.query(Sql,function (err, resultthome)
      {
       Sql=`INSERT INTO thomerentapartmentcommercial(Id_Rl_Thome,AgeBuilding,NumberRoom,Tp_Bottom,
        Tp_Kitchen,Tp_Wall,Zirbana,Tp_Teras,Description_HomeBussinece,Description_MalekHome,
        Tabaghe,Vahed,Tp_ArrowHome,Tp_Water,Tp_Bargh,Tp_Gaz,Tp_Tel,Tp_Garmayesh,Tp_Asansoor,
        Tp_MohafezDoorVoroodi,Tp_Camera,Tp_Parking,Tp_Anbari,Tp_SanadApartment,
        Tp_NamaBuilding,MoneyMortgage,MoneyRent,Tp_ConvertMortgageRent,Tp_StatusOwner,Tp_StatusDischarge,
        Tp_StatusLocation,Tp_Commercial)
         VALUES (${resultthome.insertId},${data.AgeBuliding},
          ${data.NumberRoom},${data.Id_Bottom},${data.Id_Kitchen},${data.Id_Wall},${data.Zirbana},
          ${data.Id_Teras},'${data.DescriptionMoshaver}','${data.DescriptionOwnerHomer}',
          ${data.Tabaghe},${data.Vahed},${data.Id_Arrow},${data.Id_Water},${data.Id_Bargh},${data.Id_Gaz},
          ${data.Id_LineTel},${data.Id_Garmayesh},${data.Id_Asansoor},
          ${data.Id_MohafezDoor},${data.Id_Camera},${data.Id_Parking},${data.Id_Anbari},${data.Id_Sanad},
          ${data.Id_Nama},${data.MoneyMortgage},${data.MoneyRent},${data.Id_ConvertMortgageRent},
          ${data.Id_StatusOwner},${data.Id_StatusDischarge},${data.Id_StatusLocation},
          ${data.Id_TpCommercial})`;
        if (err)
        {
          Error(err);
        } else
        {
          con.query(Sql,function (err, res)
          {
            if (err)
            {
              Error(err);
            } else
            {
              if (data.LogoHome!="")
              {

                var base64Img = require('base64-img');
                base64Img.img('data:image/png;base64,'+data.LogoHome, 'Image/Home', Header.Id_Request, function(err, filepath) 
                {
                  
                });
			          var Res_CallBack={Id:resultthome.insertId,Id_Request:Header.Id_Request,
                Date:Date.GetDateCurrent(),RequestView:0,LogoHome:Header.Id_Request+'.png'};
				        CallBack(Res_CallBack);
              } else
			        {
				  
				        var Res_CallBack={Id:resultthome.insertId,Id_Request:Header.Id_Request,
                Date:Date.GetDateCurrent(),RequestView:0};
				        CallBack(Res_CallBack);
			        }
             
            }                            
          });              
        }
        con.end();
      });
    }
  });    
}
function  UpdateRentApartmentCommercial (con,DataApp,Error,CallBack) 
{
  var Header=DataApp.HeaderRequest;
  var data=DataApp.Data;  
  var Date=require("./Date_F.js")
  con.connect(function(err)
  {
    if (err)
    {

      Error(err);
      
    } else
    {

      var Sql=`update thome set `;
      if (data.LogoHome!="") Sql=Sql+` LogoHome='${Header.Id_Request}.png',`; else Sql=Sql+` LogoHome='',`;
      Sql=Sql+`Description='${data.SubjectAdvertising}',Ostan=${data.Id_Ostan},City=${data.Id_City}
      ,Zone=${data.Id_Zone},Latitude=${data.Latitude},Longtitude=${data.Longtitude},
              DateStart=${Date.GetDateCurrent()},Tp_LevelAdvertising=${data.Id_TimeAdvertising},
              Tp_RegistrationAdvertising=${data.Tp_RegistrationAdvertising} where Id_Request='${Header.Id_Request}' `;
      con.query(Sql,function (err, resultthome)
      {
       Sql=`update thomerentapartmentcommercial set AgeBuilding=${data.AgeBuliding},NumberRoom=${data.NumberRoom}
       ,Tp_Bottom=${data.Id_Bottom},Tp_Kitchen=${data.Id_Kitchen},Tp_Wall=${data.Id_Wall},
       Zirbana=${data.Zirbana},Tp_Teras=${data.Id_Teras},Description_HomeBussinece='${data.DescriptionMoshaver}'
       ,Description_MalekHome='${data.DescriptionOwnerHomer}',Tabaghe=${data.Tabaghe},Vahed=${data.Vahed}
       ,Tp_ArrowHome=${data.Id_Arrow},Tp_Water=${data.Id_Water},Tp_Bargh=${data.Id_Bargh},Tp_Gaz=${data.Id_Gaz}
       ,Tp_Tel= ${data.Id_LineTel},Tp_Garmayesh=${data.Id_Garmayesh},Tp_Asansoor=${data.Id_Asansoor},
        Tp_MohafezDoorVoroodi=${data.Id_MohafezDoor},Tp_Camera=${data.Id_Camera},Tp_Parking=${data.Id_Parking}
        ,Tp_Anbari=${data.Id_Anbari},Tp_SanadApartment=${data.Id_Sanad},
        Tp_NamaBuilding=${data.Id_Nama},MoneyMortgage=${data.MoneyMortgage},MoneyRent=${data.MoneyRent}
        ,Tp_ConvertMortgageRent=${data.Id_ConvertMortgageRent},Tp_StatusOwner=${data.Id_StatusOwner}
        ,Tp_StatusDischarge=${data.Id_StatusDischarge},Tp_StatusLocation=${data.Id_StatusLocation},
        Tp_Commercial=${data.Id_TpCommercial} where Id_Rl_Thome=${data.IdHome}`;
        if (err)
        {
          Error(err);
        } else
        {
          con.query(Sql,function (err, res)
          {
            if (err)
            {
              Error(err);
            } else
            {
              if (data.LogoHome!="")
              {

                var base64Img = require('base64-img');
                base64Img.img('data:image/png;base64,'+data.LogoHome, 'Image/Home', Header.Id_Request, function(err, filepath) 
                {
                  
                });
			          var Res_CallBack={Id:resultthome.insertId,Id_Request:Header.Id_Request,
                Date:Date.GetDateCurrent(),RequestView:0,LogoHome:Header.Id_Request+'.png'};
				        CallBack(Res_CallBack);
              } else
			        {
				  
				        var Res_CallBack={Id:resultthome.insertId,Id_Request:Header.Id_Request,
                Date:Date.GetDateCurrent(),RequestView:0};
				        CallBack(Res_CallBack);
			        }
             
            }                            
          });              
        }
        con.end();
      });
    }
  });    
}
function SaveSaleEarth(con, DataApp, Error, CallBack) {
    var Date = require("./Date_F.js")
    con.connect(function (err) {
        if (err) {

            Error(err);

        } else
        {
            var data = DataApp.Data;
            var Header = DataApp.HeaderRequest;
            console.log(DataApp.HeaderRequest);
            var Sql = `INSERT INTO thome(Id_Request,LogoHome,Id_Rl_thomebussinece,Description,Tp_Home,Ostan,
            City,Zone,Address,Tel,Latitude,Longtitude,
            DateStart,Tp_LevelAdvertising,RequestView,Status,Tp_RegistrationAdvertising) VALUES 
            (${Header.Id_Request},'',${data.Id_User},'${data.SubjectAdvertising}',5,${data.Id_Ostan},${data.Id_City},
            ${data.Id_Zone},'${data.Address}','${data.Tel}'
            ,${data.Latitude},${data.Longtitude},${Date.GetDateCurrent()},${data.Id_TimeAdvertising},
            0,1,${data.Tp_RegistrationAdvertising})`;
            console.log(Sql);
            con.query(Sql, function (err, resultthome)
            {
                if (err) {
                    Error(err);
                } else
                {
                    Sql = `INSERT INTO thomesaleearth(Id_Rl_Thome, Metric, MoneySale, Description_HomeBussinece, 
                      Description_MalekHome, Tp_Water,Tp_Bargh,Tp_Gaz,Tp_Tel,Tp_Sanad,Tp_TypeOfDensity,Tp_AccountType,
                      Tp_StatusLocation)  VALUES (${resultthome.insertId},${data.Metric},
                ${data.MoneySale},'${data.DescriptionMoshaver}','${data.DescriptionOwnerHomer}',
                ${data.Id_Water},${data.Id_Bargh},
                ${data.Id_Gaz},${data.Id_LineTel},${data.Id_Sanad},${data.Id_TypeOfDensity},${data.Id_AccountType},
                ${data.Id_StatusLocation})`;
                  

                    con.query(Sql, function (err, res) {
                        if (err) {

                            Error(err);
                        } else
                        {
                         var Res_CallBack ={ Id: resultthome.insertId, Id_Request: Header.Id_Request,
                                Date: Date.GetDateCurrent(), RequestView: 0};
                            CallBack(Res_CallBack);
                            
                        }
                    });
                }
                con.end();
            });
        }
    });
}
function UpdateSaleEarth(con, DataApp, Error, CallBack) {
    var Header = DataApp.HeaderRequest;
    var data = DataApp.Data;
    var Date = require("./Date_F.js")
    con.connect(function (err) {
        if (err) {

            Error(err);

        } else
        {
          var Sql = `update thome set LogoHome='',Description='${data.SubjectAdvertising}',Ostan=${data.Id_Ostan},City=${data.Id_City}
          ,Zone=${data.Id_Zone},Address='${data.Address}',Tel='${data.Tel}',Latitude=${data.Latitude},Longtitude=${data.Longtitude},
          DateStart=${Date.GetDateCurrent()},Tp_LevelAdvertising=${data.Id_TimeAdvertising},Tp_RegistrationAdvertising=${data.Tp_RegistrationAdvertising}  where Id_Request='${Header.Id_Request}' `;
          console.log(Sql);
          con.query(Sql, function (err, resultthome)
          {
             
              if (err) {
                  console.log(err);
                    Error(err);
              } else {
                  Sql = `update thomesaleearth set Description_MalekHome='${data.DescriptionOwnerHomer}'
                        ,Description_HomeBussinece='${data.DescriptionMoshaver}'
                        ,Tp_Water=${data.Id_Water},Tp_Bargh=${data.Id_Bargh},Tp_Gaz=${data.Id_Gaz}
                        ,Tp_Tel= ${data.Id_LineTel},Tp_Sanad=${data.Id_Sanad},MoneySale=${data.MoneySale}
                        ,Tp_StatusLocation=${data.Id_StatusLocation},Tp_AccountType=${data.Id_AccountType}
                        ,Tp_TypeOfDensity=${data.Id_TypeOfDensity}  where Id_Rl_Thome=${data.IdHome}`;
                  console.log(Sql);
                    con.query(Sql, function (err, res) {
                        if (err)
                        {
                            console.log(err);
                          Error(err);
                        } else
                        {
                            var Res_CallBack = { Id: data.IdHome, Id_Request: Header.Id_Request, Date: Date.GetDateCurrent(), RequestView: 0};
                         CallBack(Res_CallBack);
                        }
                    });
                }
                con.end();
            });
        }
    });
}
function DeleteItemhome(con, DataApp, Error, CallBack) {
   
    con.connect(function (err) {
        if (err) {
            console.log(err);
            Error(err);

        } else
        {
            var Sql = ` delete from ${DataApp.TblHomeDetails} where Id_Rl_Thome in (select Id from thome where Id_Request='${DataApp.Id_Request}') `;
            console.log(Sql);
                if (err) {
                    Error(err);
                } else {
                    con.query(Sql, function (err, res) {
                        if (err)
                        {
                            console.log(err);
                            Error(err);
                        } else
                        {
                            Sql = `delete from thome where Id_Request='${DataApp.Id_Request}'`
                            console.log(Sql);
                            con.query(Sql, function (err, reshead)
                            {
                                if (err)
                                {
                                    cosole.log(err);
                                    Error(err);
                                } else
                                {

                                    var fs = require('fs');
                                    fs.stat('./Image/Home/' + DataApp.Id_Request + '.png', function (err, stats) {
                                        if (err)
                                        {
                                          
                                        } else
                                        {
                                            fs.unlink('./Image/Home/' + DataApp.Id_Request + '.png', function (err)
                                            {


                                            });
                                        }
                                    });
                                    var Res_CallBack = { Header: true, Details: true, Id_Request: DataApp.Id_Request, Tp_Home: DataApp.Tp_Home };
                                    console.log(Res_CallBack);
                                  CallBack(Res_CallBack);

                                }
                            });
                            con.end();
                            
                        }
                    });
                }
                
           
        }
    });
}
module.exports.NewRegisterAdvertising=NewRegisterAdvertising;
module.exports.UpdateRegisterAdvertising=UpdateRegisterAdvertising;
module.exports.SaveSaleApartmentResidential=SaveSaleApartmentResidential;
module.exports.UpdateSaleApartmentResidential=UpdateSaleApartmentResidential;
module.exports.SaveRentApartmentResidential=SaveRentApartmentResidential;
module.exports.UpdateRentApartmentResidential=UpdateRentApartmentResidential;
module.exports.SaveSaleApartmentCommercial=SaveSaleApartmentCommercial;
module.exports.UpdateSaleApartmentCommercial=UpdateSaleApartmentCommercial;
module.exports.SaveRentApartmentCommercial=SaveRentApartmentCommercial;
module.exports.UpdateRentApartmentCommercial = UpdateRentApartmentCommercial;
module.exports.SaveSaleEarth = SaveSaleEarth;
module.exports.UpdateSaleEarth = UpdateSaleEarth;
module.exports.DeleteItemhome = DeleteItemhome;